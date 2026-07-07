import os
import json
from typing import Dict, TypedDict
from openai import OpenAI
from pyairtable import Api  # Modern standard client for Airtable

# Initialize clients
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

# Initialize Airtable (Will use fallback variables if not fully configured yet)
AIRTABLE_TOKEN = os.environ.get("AIRTABLE_API_KEY", "mock_token")
BASE_ID = os.environ.get("AIRTABLE_BASE_ID", "mock_base")
TABLE_NAME = os.environ.get("AIRTABLE_TABLE_NAME", "Community_Updates")

# 1. Define State
class AgentState(TypedDict):
    raw_input: str
    extracted_json: str
    validation_feedback: str
    iterations: int
    is_valid: bool

# [Keep your previous extractor_agent and validator_agent functions completely as they are]

# 2. Tool Execution: Push verified payload to database
def save_to_airtable(json_string: str) -> bool:
    print("--- WRITING TO PRODUCTION DATABASE (AIRTABLE) ---")
    try:
        # Parse the string into a clean Python dictionary
        data_fields = json.loads(json_string)
        
        # If in playground/mock mode, simulate the success
        if "mock" in AIRTABLE_TOKEN or "mock" in BASE_ID:
            print(f"[Mock Mode] Successfully simulated database write for: {data_fields['title']}")
            return True
            
        # Code-first execution against production API
        airtable_api = Api(AIRTABLE_TOKEN)
        table = airtable_api.table(BASE_ID, TABLE_NAME)
        table.create(data_fields)
        print("🎉 Successfully committed entry to live database table.")
        return True
        
    except Exception as e:
        print(f"❌ Error committing data to database: {str(e)}")
        return False

# 3. Updated Orchestrator Loop
def run_pipeline(raw_text: str) -> Dict:
    state: AgentState = {
        "raw_input": raw_text,
        "extracted_json": "",
        "validation_feedback": "",
        "iterations": 0,
        "is_valid": False
    }
    
    # Core multi-agent state evaluation loop
    while not state["is_valid"] and state["iterations"] < 3:
        state.update(extractor_agent(state))
        state.update(validator_agent(state))
        
    # NEW STEP: If the data is completely validated, trigger the database tool
    if state["is_valid"]:
        db_success = save_to_airtable(state["extracted_json"])
        state["database_synchronized"] = db_success
    else:
        state["database_synchronized"] = False
        print("⚠️ Pipeline exited without syncing. Data quality requirements not met.")
        
    return state

# --- Test Execution ---
if __name__ == "__main__":
    sample_text = "Hey neighbors! We are holding the annual Conyers block party over at the central park commons. It's happening this Saturday afternoon, but we still don't know the exact time yet. There will be food trucks!"
    
    final_output = run_pipeline(sample_text)

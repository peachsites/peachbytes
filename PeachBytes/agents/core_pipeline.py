import os
from typing import Dict, TypedDict
from openai import OpenAI

# Initialize client (can easily swap between OpenAI, Gemini, or open-source)
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

# 1. Define the State of our pipeline
class AgentState(TypedDict):
    raw_input: str
    extracted_json: str
    validation_feedback: str
    iterations: int
    is_valid: bool

# 2. Agent A: The Extractor
def extractor_agent(state: AgentState) -> Dict:
    print("--- EXTRACTOR AGENT RUNNING ---")
    feedback = state.get("validation_feedback", "None")
    
    system_prompt = (
        "You are an expert Data Extraction Agent. Your job is to parse unstructured community text "
        "and return a strict JSON object with these keys: 'title', 'date', 'location', 'summary'. "
        "If you receive feedback about a previous error, correct it immediately."
    )
    
    user_content = f"Raw Text: {state['raw_input']}\nPrevious Feedback: {feedback}"
    
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_content}
        ]
    )
    
    return {
        "extracted_json": response.choices[0].message.content,
        "iterations": state.get("iterations", 0) + 1
    }

# 3. Agent B: The Evaluator / Validator
def validator_agent(state: AgentState) -> Dict:
    print("--- VALIDATOR AGENT RUNNING ---")
    current_json = state["extracted_json"]
    
    system_prompt = (
        "You are a strict Data Compliance Auditor. Inspect the provided JSON string. "
        "Verify that it contains valid JSON structure and no keys are empty or flagged as 'unknown'. "
        "Respond with EXACTLY 'VALID' if it passes. If it fails, provide explicit feedback on what is missing."
    )
    
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": current_json}
        ]
    )
    
    result = response.choices[0].message.content.strip()
    
    if "VALID" in result:
        return {"is_valid": True, "validation_feedback": ""}
    else:
        return {"is_valid": False, "validation_feedback": result}

# 4. Simple Deterministic Router Loop
def run_pipeline(raw_text: str) -> Dict:
    # Initialize state
    state: AgentState = {
        "raw_input": raw_text,
        "extracted_json": "",
        "validation_feedback": "",
        "iterations": 0,
        "is_valid": False
    }
    
    # Run loop up to 3 times to prevent infinite API billing
    while not state["is_valid"] and state["iterations"] < 3:
        state.update(extractor_agent(state))
        state.update(validator_agent(state))
        
    return state

# --- Execution Test ---
if __name__ == "__main__":
    sample_text = "Hey neighbors! We are holding the annual Conyers block party over at the central park commons. It's happening this Saturday afternoon, but we still don't know the exact time yet. There will be food trucks!"
    
    final_output = run_pipeline(sample_text)
    print("\n--- FINAL AGENT STATE RESULT ---")
    print(f"Iterations: {final_output['iterations']}")
    print(f"Is Valid: {final_output['is_valid']}")
    print(f"Resulting Payload: \n{final_output['extracted_json']}")
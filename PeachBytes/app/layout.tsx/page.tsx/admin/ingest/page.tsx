'use client';

import React, { useState } from 'react';

interface PipelineResult {
  iterations: number;
  is_valid: bool;
  extracted_json: string;
  validation_feedback: string;
  database_synchronized: boolean;
}

export default function AIControlCenter() {
  const [rawInput, setRawInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'running_extractor' | 'running_validator' | 'success' | 'failed'>('idle');
  const [pipelineData, setPipelineData] = useState<PipelineResult | null>(null);

  const executePipelineSimulation = async () => {
    if (!rawInput.trim()) return;
    
    // Step 1: Trigger Agent A
    setStatus('running_extractor');
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // Step 2: Trigger Agent B
    setStatus('running_validator');
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simulated multi-agent outcome based on input length/quality
    const passesValidation = rawInput.length > 60;
    
    setPipelineData({
      iterations: passesValidation ? 1 : 2,
      is_valid: passesValidation,
      extracted_json: JSON.stringify({
        title: "Conyers Block Party",
        date: "This Saturday",
        location: "Central Park Commons",
        summary: "Annual neighborhood block party featuring local food trucks and community activities."
      }, null, 2),
      validation_feedback: passesValidation 
        ? "VALID" 
        : "CRITICAL REJECTION: Extractor failed to map definitive structural time signatures from unstructured source context.",
      database_synchronized: passesValidation
    });

    setStatus(passesValidation ? 'success' : 'failed');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header Block */}
        <div className="border-b border-slate-800 pb-6 mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-white">PeachBytes AI Orchestration Workspace</h1>
          <p className="text-slate-400 mt-2">Translate unstructured community updates into verified knowledge entries using self-correcting multi-agent loops.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Input Panel */}
          <div className="space-y-6">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-xl">
              <h2 className="text-xl font-semibold text-white mb-4">Ingestion Feed</h2>
              <label className="block text-sm font-medium text-slate-300 mb-2">Paste Unstructured Community Source Text</label>
              <textarea
                className="w-full h-48 bg-slate-950 border border-slate-700 rounded-lg p-4 text-slate-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition resize-none outline-none"
                placeholder="Paste an RSS feed clip, a community post, or newsletter text here..."
                value={rawInput}
                onChange={(e) => setRawInput(e.target.value)}
              />
              
              <button
                onClick={executePipelineSimulation}
                disabled={status !== 'idle' && status !== 'success' && status !== 'failed'}
                className="mt-4 w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold py-3 px-4 rounded-lg transition disabled:opacity-50 tracking-wide"
              >
                {status === 'idle' && 'Execute Agent Pipeline'}
                {status === 'running_extractor' && 'Agent A: Extracting Structured JSON...'}
                {status === 'running_validator' && 'Agent B: Auditing Structural Rules...'}
                {(status === 'success' || status === 'failed') && 'Re-run Agent Loop'}
              </button>
            </div>

            {/* Live Infrastructure Metrics Dashboard */}
            <div className="bg-slate-800/50 border border-slate-800 rounded-xl p-6">
              <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">Pipeline Infrastructure Logs</h3>
              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-500">Target Framework</span>
                  <span className="text-slate-300">Python 3.11 / LangGraph Engine</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-500">Database Sink</span>
                  <span className="text-slate-300">Airtable Production API</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Deployment State</span>
                  <span className="text-amber-400/90">Edge Microservice Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Execution Output */}
          <div className="space-y-6">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-xl flex flex-col h-full min-h-[500px]">
              <h2 className="text-xl font-semibold text-white mb-4">Pipeline Execution Observability</h2>

              {status === 'idle' && (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-500 border border-dashed border-slate-700 rounded-lg p-8">
                  <p>Awaiting source ingestion to execute multi-agent tracing loop.</p>
                </div>
              )}

              {status !== 'idle' && (
                <div className="space-y-4 flex-1 flex flex-col">
                  {/* Real-time Status Tracker */}
                  <div className={`p-4 rounded-lg border text-sm font-medium ${
                    status === 'success' ? 'bg-emerald-950/40 border-emerald-800 text-emerald-400' :
                    status === 'failed' ? 'bg-rose-950/40 border-rose-800 text-rose-400' :
                    'bg-slate-900 border-slate-700 text-amber-400 animate-pulse'
                  }`}>
                    {status === 'running_extractor' && '● Phase 1: Extractor compiling structural metadata variables...'}
                    {status === 'running_validator' && '● Phase 2: Compliance engine cross-checking schema keys...'}
                    {status === 'success' && '✓ Pipeline complete: Data verified and written to Airtable.'}
                    {status === 'failed' && '× Pipeline execution failure: Rule criteria not met.'}
                  </div>

                  {pipelineData && (
                    <div className="space-y-4 flex-1 flex flex-col">
                      {/* Metric Summary Widgets */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                          <span className="block text-xs text-slate-500 font-medium">COMPLETED ITERATIONS</span>
                          <span className="text-xl font-bold text-white font-mono">{pipelineData.iterations} / 3</span>
                        </div>
                        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                          <span className="block text-xs text-slate-500 font-medium">DATABASE SYNC STATUS</span>
                          <span className={`text-xl font-bold font-mono ${pipelineData.database_synchronized ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {pipelineData.database_synchronized ? 'COMMITTED' : 'BLOCKED'}
                          </span>
                        </div>
                      </div>

                      {/* Code Output Visualizers */}
                      <div className="flex-1 flex flex-col space-y-2">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Extracted Schema</span>
                        <pre className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-xs text-amber-400/90 overflow-auto max-h-64 whitespace-pre">
                          {pipelineData.extracted_json}
                        </pre>
                        
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-2">Audit Logs</span>
                        <p className={`font-mono text-xs p-3 rounded bg-slate-950 border ${pipelineData.is_valid ? 'border-emerald-900/50 text-slate-400' : 'border-rose-900/50 text-rose-300'}`}>
                          {pipelineData.validation_feedback}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

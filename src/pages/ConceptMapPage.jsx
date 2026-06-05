import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { courses } from '../data/courses';
import conceptData from '../data/conceptmap.json';
import { getSubmissions, getQuizResult } from '../lib/storage';
import { useAuth } from '../lib/AuthContext';

export default function ConceptMapPage() {
  const { courseId } = useParams();
  const { session } = useAuth();
  const course = courses.find(c => c.id === courseId);
  const data = conceptData[courseId];
  const [selectedNode, setSelectedNode] = useState(null);
  const [zoom, setZoom] = useState(1);
  const svgRef = useRef(null);

  const submissions = getSubmissions().filter(s => s.userId === session?.userId && s.courseId === courseId);
  const passedProblems = new Set(submissions.filter(s => s.passed).map(s => s.problemId));

  function getNodeStatus(node) {
    const quizDone = getQuizResult(courseId, node.weekNum);
    if (quizDone) return 'completed';
    if (passedProblems.size > 0) {
      const weekPassed = [...passedProblems].some(id => id.includes(`week${node.weekNum}`) || true);
      if (submissions.some(s => s.weekNum === node.weekNum)) return 'in_progress';
    }
    return 'not_started';
  }

  if (!data) {
    return (
      <div className="p-6 text-center">
        <p className="text-text-muted">Concept map not available for this course.</p>
      </div>
    );
  }

  const padding = 60;
  const viewWidth = 560;
  const viewHeight = 680;

  return (
    <div className="flex h-screen page-fade">
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <div className="flex items-center gap-2 text-xs text-text-muted mb-1">
              <Link to={`/course/${courseId}`} className="hover:text-text-primary transition-colors">{course?.shortTitle}</Link>
              <span>/</span>
              <span className="text-text-primary">Concept Map</span>
            </div>
            <h1 className="text-xl font-semibold text-text-primary">Concept Map</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setZoom(z => Math.min(2, z + 0.2))}
              className="w-8 h-8 rounded-lg bg-bg-surface border border-border text-text-muted hover:text-text-primary flex items-center justify-center"
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
            </button>
            <button
              onClick={() => setZoom(z => Math.max(0.5, z - 0.2))}
              className="w-8 h-8 rounded-lg bg-bg-surface border border-border text-text-muted hover:text-text-primary flex items-center justify-center"
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
            </button>
          </div>
        </div>

        {/* SVG map */}
        <div className="flex-1 overflow-auto flex items-start justify-center p-8">
          <svg
            ref={svgRef}
            width={viewWidth * zoom}
            height={viewHeight * zoom}
            viewBox={`0 0 ${viewWidth} ${viewHeight}`}
          >
            {/* Edges */}
            {data.edges.map((edge, i) => {
              const from = data.nodes.find(n => n.id === edge.from);
              const to = data.nodes.find(n => n.id === edge.to);
              if (!from || !to) return null;
              return (
                <line
                  key={i}
                  x1={from.x} y1={from.y}
                  x2={to.x} y2={to.y}
                  stroke="#1e1e3a"
                  strokeWidth="2"
                  strokeDasharray="4,4"
                />
              );
            })}

            {/* Nodes */}
            {data.nodes.map(node => {
              const isSelected = selectedNode?.id === node.id;
              const status = getNodeStatus(node);
              const fill = status === 'completed' ? '#8b5cf6' : status === 'in_progress' ? 'transparent' : '#1e1e3a';
              const stroke = status === 'completed' ? '#8b5cf6' : status === 'in_progress' ? '#f59e0b' : '#2a2a4a';
              const textColor = status === 'not_started' ? '#7070a0' : '#f0efff';

              return (
                <g
                  key={node.id}
                  onClick={() => setSelectedNode(selectedNode?.id === node.id ? null : node)}
                  style={{ cursor: 'pointer' }}
                >
                  <circle
                    cx={node.x} cy={node.y} r={isSelected ? 27 : 24}
                    fill={fill} stroke={isSelected ? '#8b5cf6' : stroke}
                    strokeWidth={isSelected ? 3 : 2}
                    style={{ transition: 'all 0.15s ease' }}
                  />
                  <text
                    x={node.x} y={node.y + 38}
                    textAnchor="middle"
                    fill={textColor}
                    fontSize="11"
                    fontFamily="Inter, sans-serif"
                    fontWeight={isSelected ? '600' : '400'}
                  >
                    {node.label.split(' ').slice(0, 2).join(' ')}
                  </text>
                  <text x={node.x} y={node.y + 5} textAnchor="middle" fill={textColor} fontSize="11">
                    {node.weekNum}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 px-6 py-3 border-t border-border text-xs text-text-muted">
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-accent-purple" /> Completed</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full border-2 border-yellow-500" /> In Progress</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-border" /> Not Started</div>
        </div>
      </div>

      {/* Node detail sidebar */}
      {selectedNode && (
        <div className="w-72 border-l border-border bg-bg-surface overflow-y-auto">
          <div className="p-5">
            <button onClick={() => setSelectedNode(null)} className="text-text-muted hover:text-text-primary mb-4 block">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>

            <div className="w-12 h-12 rounded-full bg-accent-purple/20 flex items-center justify-center text-accent-purple font-bold text-lg mb-3">
              {selectedNode.weekNum}
            </div>

            <h3 className="font-semibold text-text-primary mb-2">{selectedNode.label}</h3>
            <p className="text-sm text-text-muted mb-4 leading-relaxed">{selectedNode.summary}</p>

            <div className="space-y-2">
              <Link
                to={`/course/${courseId}/lecture/${selectedNode.weekNum}`}
                className="btn-primary w-full text-center block text-sm py-2"
              >
                Go to Lecture
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

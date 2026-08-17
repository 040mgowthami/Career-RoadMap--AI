import { useState } from 'react'
import ProjectRecommendations from './ProjectRecommendations';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'
const OPENROUTER_MODEL = 'meta-llama/llama-3.1-8b-instruct'

const TIME_OPTIONS = [
  { value: '1 month', label: '1 months' },
  { value: '2 months', label: '2 months' },
  { value: '3 months', label: '3 months' },
  { value: '4 months', label: '4 months' },
  { value: '5 months', label: '5 months' },
  { value: '6 months', label: '6 months' },
  { value: '7 months', label: '7 months' },
  { value: '8 months', label: '8 months' },
  { value: '9 months', label: '9 months' },
  { value: '10 months', label: '10 months' },
  { value: '11 months', label: '11 months' },
  { value: '12 months', label: '12 months' },
]

function LoadingAnimation() {
  return (
    <div className="flex flex-col items-center gap-6 py-16">
      <div className="relative flex h-24 w-24 items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-violet-500/30 to-cyan-400/30 blur-xl animate-pulse-glow" />
        <div className="absolute h-16 w-16 rounded-full border-2 border-violet-400/40" />
        <div className="absolute h-3 w-3 rounded-full bg-violet-400 animate-orbit" />
        <div
          className="absolute h-2 w-2 rounded-full bg-cyan-400 animate-orbit"
          style={{ animationDelay: '-0.75s', animationDuration: '2s' }}
        />
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 shadow-lg shadow-violet-500/50" />
      </div>
      <div className="text-center">
        <p className="text-lg font-medium text-white">Crafting your roadmap</p>
        <p className="mt-1 text-sm text-violet-200/70">
          Analyzing skills and building your personalized path…
        </p>
      </div>
      <div className="h-1.5 w-48 overflow-hidden rounded-full bg-white/10">
        <div className="h-full w-full rounded-full bg-gradient-to-r from-violet-500 via-cyan-400 to-violet-500 animate-shimmer" />
      </div>
    </div>
  )
}

function PhaseCard({ phase, isLast }) {
  return (
    <div className="relative flex gap-4 sm:gap-6">
      <div className="flex flex-col items-center">
        <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 text-sm font-bold text-white shadow-lg shadow-violet-500/40 ring-4 ring-[#0f0a1f]">
          {phase.number}
        </div>
        {!isLast && (
          <div className="mt-2 w-0.5 flex-1 bg-gradient-to-b from-violet-500/60 via-cyan-400/40 to-violet-500/20" />
        )}
      </div>

      <div className="mb-8 flex-1 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition-all hover:border-violet-400/30 hover:bg-white/[0.07] sm:p-6">
        <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
          <h3 className="text-lg font-semibold text-white sm:text-xl">
            {phase.title}
          </h3>
          <span className="inline-flex items-center rounded-full bg-violet-500/20 px-3 py-1 text-xs font-medium text-violet-200 ring-1 ring-violet-400/30">
            {phase.duration}
          </span>
        </div>

        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-cyan-300/80">
          Skills to learn
        </p>
        <ul className="flex flex-wrap gap-2">
          {phase.skills.map((skill) => (
            <li
              key={skill}
              className="rounded-lg bg-gradient-to-r from-violet-500/15 to-cyan-400/10 px-3 py-1.5 text-sm text-violet-100 ring-1 ring-white/10"
            >
              {skill}
            </li>
          ))}
        </ul>
        {/* Recommended Projects and Learning Resources */}
{(phase.projects?.length > 0 || phase.resources?.length > 0) && (
  <ProjectRecommendations
    projects={phase.projects}
    resources={phase.resources}

  />
)}
      </div>
    </div>
  )
}

async function generateRoadmap({ careerGoal, currentSkills, timeAvailable }) {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY
  if (!apiKey) {
    throw new Error(
      'VITE_OPENROUTER_API_KEY is not set. Add it to a .env file in the project root.',
    )
  }

  const prompt = `
You are an expert career coach.

Create a personalized learning roadmap based on:

Target Job Role:
${careerGoal}

Programming Languages & Skills:
${currentSkills}

Available Learning Time:
${timeAvailable}

The roadmap must be strongly related to the Target Job Role and the Programming Languages & Skills.

For each phase provide:

1. Skills to learn
2. At least one practical real-world project
3. A short project description
4. Technologies required for the project
5. Relevant tutorial websites
6. Relevant YouTube learning resources

Projects must be practical and useful for the Target Job Role.

Tutorials and YouTube resources must be directly related to the skills and projects.

Do NOT recommend unrelated technologies.

Return ONLY valid JSON in exactly this format:

{
  "phases": [
    {
      "title": "Phase title",
      "duration": "Weeks 1-2",
      "skills": [
        "Skill 1",
        "Skill 2",
        "Skill 3"
      ],
      "projects": [
        {
          "title": "Project title",
          "description": "Short project description",
          "technologies": [
            "Python",
            "Flask",
            "SQL"
          ]
        }
      ],
      "resources": [
        {
          "title": "Python Tutorial",
          "platform": "W3Schools",
          "url": "https://www.w3schools.com/python/"
        },
        {
          "title": "Python Web Development Tutorial",
          "platform": "YouTube",
          "url": "https://www.youtube.com/results?search_query=python+web+development+tutorial"
        }
      ]
    }
  ]
}

Create 4-6 phases that fit within the available time.

Make all recommendations specific to the Target Job Role:
${careerGoal}

Use the user's Programming Languages & Skills:
${currentSkills}
`;

  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'AI Career Roadmap Generator',
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error?.message || 'OpenRouter API request failed')
  }

  const text = data.choices?.[0]?.message?.content ?? ''
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error('Could not parse roadmap from AI response')
  }

  const parsed = JSON.parse(jsonMatch[0])

if (!parsed.phases?.length) {
  throw new Error('No roadmap phases were returned')
}

return parsed.phases.map((phase, index) => ({
  number: index + 1,
  title: phase.title,
  duration: phase.duration,
  skills: phase.skills || [],
  projects: phase.projects || [],
  resources: phase.resources || [],
}))
}

function RoadmapTimeline({ phases, careerGoal }) {
  return (
    <div className="mt-10">
      <h2 className="mb-2 text-center text-2xl font-bold text-white sm:text-3xl">
        Your Career Roadmap
      </h2>
      <p className="mb-6 text-center text-sm text-violet-200/60">
        Path to {careerGoal}
      </p>
      <div className="mx-auto max-w-2xl">
        {phases.map((phase, index) => (
          <PhaseCard
            key={phase.number}
            phase={phase}
            isLast={index === phases.length - 1}
          />
        ))}
      </div>
    </div>
  )
}

function App() {
  const [careerGoal, setCareerGoal] = useState('')
  const [currentSkills, setCurrentSkills] = useState('')
  const [timeAvailable, setTimeAvailable] = useState('1 months')
  const [phases, setPhases] = useState(null)
  const [submittedGoal, setSubmittedGoal] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setPhases(null)

    if (!careerGoal.trim() || !currentSkills.trim()) {
      setError('Please fill in your career goal and current skills.')
      return
    }

    setLoading(true)

    try {
      const roadmapPhases = await generateRoadmap({
        careerGoal: careerGoal.trim(),
        currentSkills: currentSkills.trim(),
        timeAvailable,
      })
      setSubmittedGoal(careerGoal.trim())
      setPhases(roadmapPhases)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0a1f] via-[#1a1035] to-[#0a1628]">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl" />
        <div className="absolute -right-32 top-1/3 h-96 w-96 rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-indigo-600/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16 lg:py-20">
        <header className="mb-10 text-center sm:mb-12">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-200">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            Powered by AI
          </div>
          <h1 className="bg-gradient-to-r from-white via-violet-100 to-cyan-200 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl lg:text-5xl">
           Career RoadMap AI
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-violet-200/70 sm:text-lg">
            Generate a personalized AI-powered learning roadmap based on your career goal, current skills, education, and available learning time.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md sm:p-8"
        >
          <div className="space-y-5">
            <div>
              <label
                htmlFor="careerGoal"
                className="mb-2 block text-sm font-medium text-violet-100"
              >
                Target Job Role
              </label>
              <input
                id="careerGoal"
                type="text"
                value={careerGoal}
                onChange={(e) => setCareerGoal(e.target.value)}
                placeholder="e.g. Software Developer, AI Engineer, Data Analyst,etc."
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 outline-none transition focus:border-violet-400/50 focus:ring-2 focus:ring-violet-400/20"
                disabled={loading}
              />
            </div>

            <div>
              <label
                htmlFor="currentSkills"
                className="mb-2 block text-sm font-medium text-violet-100"
              >
                Programming Languages & Skills
              </label>
              <textarea
                id="currentSkills"
                value={currentSkills}
                onChange={(e) => setCurrentSkills(e.target.value)}
                placeholder="e.g. C, Python, Java, HTML, CSS, JavaScript,SQL, etc."
                rows={3}
                className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 outline-none transition focus:border-violet-400/50 focus:ring-2 focus:ring-violet-400/20"
                disabled={loading}
              />
            </div>

             

            <div>
              <label
                htmlFor="timeAvailable"
                className="mb-2 block text-sm font-medium text-violet-100"
              >
                Time Available
              </label>
              <select
                id="timeAvailable"
                value={timeAvailable}
                onChange={(e) => setTimeAvailable(e.target.value)}
                className="w-full appearance-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-violet-400/50 focus:ring-2 focus:ring-violet-400/20"
                disabled={loading}
              >
                {TIME_OPTIONS.map((opt) => (
                  <option
                    key={opt.value}
                    value={opt.value}
                    className="bg-[#1a1035] text-white"
                  >
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-violet-500/30 transition hover:from-violet-500 hover:to-cyan-400 hover:shadow-violet-500/40 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Generating…' : 'Generate My Roadmap'}
          </button>
        </form>

        {loading && <LoadingAnimation />}
        {!loading && phases && (
            <div>
    <div className="flex justify-end mb-4">
      <button
        type="button"
        onClick={() => window.print()}
        className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg shadow transition-all duration-200 flex items-center gap-2"
      >
        🖨️ Print / Save as PDF
      </button>
    </div>
    <RoadmapTimeline phases={phases} careerGoal={submittedGoal} />
  </div>
)}
         
        
      </div>
    </div>
  );
}

export default App;

function ProjectRecommendations({ projects = [], resources = [] }) {
  return (
    <div className="mt-8 space-y-8">

      {/* Recommended Projects */}
      {projects.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">
            Recommended Practical Projects
          </h2>

          <div className="grid gap-4">
            {projects.map((project, index) => (
              <div
                key={index}
                className="rounded-2xl border border-white/10 bg-white/5 p-5"
              >
                <h3 className="text-xl font-semibold text-white">
                  {project.title}
                </h3>

                <p className="mt-2 text-sm text-white/70">
                  {project.description}
                </p>

                {project.technologies?.length > 0 && (
                  <>
                    <h4 className="mt-4 text-sm font-semibold text-cyan-300">
                      Technologies
                    </h4>

                    <div className="flex flex-wrap gap-2 mt-2">
                      {project.technologies.map((technology, techIndex) => (
                        <span
                          key={techIndex}
                          className="rounded-full bg-violet-500/20 px-3 py-1 text-xs text-violet-200"
                        >
                          {technology}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Tutorials and YouTube */}
      {resources.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">
            Recommended Learning Resources
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            {resources.map((resource, index) => (
              <a
                key={index}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/10"
              >
                <h3 className="text-lg font-semibold text-white">
                  {resource.title}
                </h3>

                <p className="mt-2 text-sm text-cyan-300">
                  {resource.platform}
                </p>

                <p className="mt-3 text-sm text-white/60">
                  Open Tutorial →
                </p>
              </a>
            ))}
          </div>
        </section>
      )}

    </div>
  )
}

export default ProjectRecommendations
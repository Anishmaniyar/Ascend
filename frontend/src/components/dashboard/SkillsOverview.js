import { skills } from "@/lib/mock/dashboard";

export default function SkillsOverview() {
  return (
    <div className="space-y-5">
      {skills.map((skill) => (
        <div key={skill.topic}>
          <div className="flex items-center justify-between gap-3">
            <p className="text-15 text-graphite">{skill.topic}</p>
            <p className="font-polysans text-13 tracking-[-0.02em] text-graphite">
              {skill.accuracy}%
            </p>
          </div>
          <div className="mt-2 h-1.5 w-full rounded-full bg-canvas">
            <div
              className="h-full rounded-full bg-ember"
              style={{ width: `${skill.accuracy}%` }}
            />
          </div>
          <p className="mt-1.5 text-13 text-slate">{skill.solved} solved</p>
        </div>
      ))}
    </div>
  );
}

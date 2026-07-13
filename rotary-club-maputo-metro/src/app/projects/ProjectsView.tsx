"use client";

import { useState } from "react";
import { useLang } from "@/lib/i18n";
import { Reveal } from "@/components/Motion";
import { ProjectCard, FilterChips } from "@/components/Cards";
import type { Project } from "@/lib/data";

type Filter =
  | "all"
  | "wash"
  | "health"
  | "education"
  | "youth"
  | "active"
  | "completed";

export default function ProjectsView({ projects }: { projects: Project[] }) {
  const { t } = useLang();
  const [filter, setFilter] = useState<Filter>("all");

  const visible = projects.filter((p) => {
    if (filter === "all") return true;
    if (filter === "active" || filter === "completed")
      return p.status === filter;
    return p.category === filter;
  });

  return (
    <div className="page-in">
      <div className="section tight">
        <div className="eyebrow">{t({ pt: "Projetos", en: "Projects" })}</div>
        <h1 style={{ fontSize: 28 }}>
          {t({
            pt: "Onde o nosso serviço acontece",
            en: "Where our service happens",
          })}
        </h1>
        <p className="lead" style={{ marginTop: 10 }}>
          {t({
            pt: "Iniciativas comunitárias ativas e concluídas, lideradas pelos nossos membros e parceiros.",
            en: "Active and completed community initiatives led by our members and partners.",
          })}
        </p>
      </div>

      <div className="section" style={{ paddingTop: 0 }}>
        <FilterChips<Filter>
          active={filter}
          onChange={setFilter}
          options={[
            { value: "all", label: { pt: "Todos", en: "All" } },
            {
              value: "wash",
              label: {
                pt: "Água, Saneamento e Higiene",
                en: "Water, Sanitation & Hygiene",
              },
            },
            { value: "health", label: { pt: "Saúde", en: "Health" } },
            { value: "education", label: { pt: "Educação", en: "Education" } },
            { value: "youth", label: { pt: "Juventude", en: "Youth" } },
            { value: "active", label: { pt: "Ativos", en: "Active" } },
            { value: "completed", label: { pt: "Concluídos", en: "Completed" } },
          ]}
        />
        <Reveal>
          <h2 className="sr-only">
            {t({ pt: "Lista de projetos", en: "Project list" })}
          </h2>
          <div className="card-grid four">
            {visible.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </Reveal>
        {visible.length === 0 && (
          <p className="empty-state">
            {t({
              pt: "Ainda não há projetos para este filtro.",
              en: "No projects match this filter yet.",
            })}
          </p>
        )}
      </div>
    </div>
  );
}

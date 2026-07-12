"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { Reveal } from "@/components/Motion";
import ProjectPhotoReel from "@/components/gallery/ProjectPhotoReel";
import { getYouTubeEmbedUrl } from "@/lib/youtube";
import type { Project, GalleryItem } from "@/lib/data";

export default function ProjectDetailView({
  project,
  galleryItems,
}: {
  project: Project;
  galleryItems: GalleryItem[];
}) {
  const { t } = useLang();

  const photos: GalleryItem[] =
    galleryItems.length > 0
      ? galleryItems
      : [
          {
            id: "cover",
            url: project.image,
            mediaType: "image",
            caption: project.title,
          },
        ];

  const youtubeEmbedUrl = project.videoUrl
    ? getYouTubeEmbedUrl(project.videoUrl)
    : null;
  const hasDirectVideo = project.videoUrl && !youtubeEmbedUrl;

  return (
    <div className="page-in">
      <div className="section tight">
        <Link href="/projects" className="back-link">
          ← {t({ pt: "Todos os projetos", en: "All projects" })}
        </Link>
      </div>

      <div className="section" style={{ paddingTop: 10 }}>
        <Reveal>
          <div
            className={`project-detail-grid ${
              project.videoUrl ? "with-video" : ""
            }`}
          >
            <div>
              <ProjectPhotoReel items={photos} />
            </div>

            <div>
              <span
                className={`tagchip ${
                  project.status === "completed"
                    ? "cat-completed"
                    : `cat-${project.category}`
                }`}
              >
                {project.status === "completed"
                  ? t({ pt: "Concluído", en: "Completed" })
                  : t({ pt: "Ativo", en: "Active" })}
              </span>

              <h1 style={{ fontSize: 26, marginTop: 12 }}>{t(project.title)}</h1>

              <div className="project-detail-role">
                <span>{t(project.categoryLabel)}</span>
              </div>

              <p className="lead" style={{ whiteSpace: "pre-line" }}>
                {t(project.detail)}
              </p>

              {project.status === "active" && (
                <div style={{ marginTop: 22 }}>
                  <Link href="/get-involved" className="btn btn-primary">
                    {t({ pt: "Apoiar este Projeto", en: "Support this Project" })}
                  </Link>
                </div>
              )}
            </div>

            {project.videoUrl && (
              <div className="project-detail-video">
                <div className="video-frame">
                  {youtubeEmbedUrl ? (
                    <iframe
                      src={youtubeEmbedUrl}
                      title={t(project.title)}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : hasDirectVideo ? (
                    <video src={encodeURI(project.videoUrl)} controls />
                  ) : null}
                </div>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </div>
  );
}

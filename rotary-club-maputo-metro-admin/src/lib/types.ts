export type ProjectCategory = {
  slug: string;
  labelPt: string;
  labelEn: string;
  sortOrder: number;
};

export type AdminProject = {
  id: string;
  titlePt: string;
  titleEn: string;
  summaryPt: string;
  summaryEn: string;
  detailPt: string;
  detailEn: string;
  category: string;
  status: "active" | "completed";
  image: string;
  gallery: string[];
  videoUrl: string;
  published: boolean;
  featured: boolean;
  sortOrder: number;
};

export type GalleryItem = {
  id: string;
  storagePath: string;
  url: string;
  mediaType: "image" | "video";
  projectId: string | null;
  eventId: string | null;
  newsId: string | null;
  captionPt: string;
  captionEn: string;
  tag: string;
  status: "pending" | "approved" | "rejected";
  isCover: boolean;
  sortOrder: number;
  width: number | null;
  height: number | null;
};

export type GallerySettings = {
  style: "grid" | "masonry" | "justified" | "carousel" | "slideshow";
  fullscreen: boolean;
};

export type AdminNews = {
  id: string;
  titlePt: string;
  titleEn: string;
  excerptPt: string;
  excerptEn: string;
  bodyPt: string;
  bodyEn: string;
  author: string;
  publishedAt: string;
  published: boolean;
  sortOrder: number;
};

export type AdminEvent = {
  id: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  locationName: string;
  locationAddress: string;
  titlePt: string;
  titleEn: string;
  infoPt: string;
  infoEn: string;
  gallery: string[];
  videoUrl: string;
  published: boolean;
  sortOrder: number;
};

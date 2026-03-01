/**
 * Returns paths for competition photos.
 * Hardcoded to avoid filesystem reads.
 */
export function getCompetitionPhotoPaths(): string[] {
  return [
    "/competition-photos/1.JPG",
    "/competition-photos/2.JPG",
    "/competition-photos/3.JPG",
    "/competition-photos/4.JPG",
    "/competition-photos/5.JPG",
    "/competition-photos/6.JPG",
    "/competition-photos/7.JPG",
    "/competition-photos/8.JPG",
    "/competition-photos/9.JPG",
    "/competition-photos/10.JPG",
    "/competition-photos/11.JPG",
    "/competition-photos/12.JPG",
  ];
}

/**
 * Returns paths for bottom section photos.
 * Hardcoded to avoid filesystem reads.
 */
export function getEventPhotoPaths(): string[] {
  return [
    "/bottom-section-photos/1.PNG",
    "/bottom-section-photos/2.PNG",
    "/bottom-section-photos/3.PNG",
    "/bottom-section-photos/4.PNG",
    "/bottom-section-photos/5.PNG",
    "/bottom-section-photos/6.PNG",
  ];
}

/**
 * Returns all photo paths from both competition and event folders for the carousel.
 * Call from server only (e.g. in page or server component).
 */
export function getAllCarouselPhotoPaths(): string[] {
  const competitionPhotos = getCompetitionPhotoPaths();
  const eventPhotos = getEventPhotoPaths();
  return [...eventPhotos, ...competitionPhotos];
}
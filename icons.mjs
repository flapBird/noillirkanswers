const paths = {
  calendar:
    '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  bulb: '<path d="M9 18h6m-5 3h4M8 14a6 6 0 1 1 8 0c-1.5 1-2 2-2 3h-4c0-1-.5-2-2-3Z"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="2.5"/>',
  map: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  trophy:
    '<path d="M7 3h10v6a5 5 0 0 1-10 0V3ZM7 5H3v3c0 3 2 5 5 5m9-8h4v3c0 3-2 5-5 5m-4 1v6m-4 1h8"/>',
  game: '<path d="M7 7h10c2 0 3 2 4 6s0 7-3 5l-3-2H9l-3 2c-3 2-4-1-3-5s2-6 4-6Z"/><path d="M6 11h5m-2.5-2.5v5m6.5-2.5h.1m2.2 2h.1"/>',
  lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  layers: '<path d="m12 3 9 5-9 5-9-5zM3 12l9 5 9-5M3 16l9 5 9-5"/>',
};
export function icon(name) {
  return (
    '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' +
    paths[name] +
    "</svg>"
  );
}

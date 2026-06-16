const PLACEHOLDER = 'data:image/svg+xml,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">' +
  '<rect width="200" height="200" fill="#f5f5f5"/>' +
  '<path d="M80 90c0-11 9-20 20-20s20 9 20 20-9 20-20 20-20-9-20-20z" fill="#ddd"/>' +
  '<path d="M60 130c0-22 18-40 40-40s40 18 40 40" fill="none" stroke="#ddd" stroke-width="2"/>' +
  '<circle cx="140" cy="70" r="8" fill="#ddd"/>' +
  '</svg>'
);

export const PLACEHOLDER_IMG = PLACEHOLDER;

export function handleImgError(e) {
  e.target.src = PLACEHOLDER;
}

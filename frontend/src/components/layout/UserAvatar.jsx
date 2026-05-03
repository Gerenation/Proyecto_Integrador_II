import { resolveMediaUrl } from '../../utils/mediaUrl';

export default function UserAvatar({ usuario, size = 40 }) {
  const src = resolveMediaUrl(usuario?.fotoPerfilUrl);
  const initial = (usuario?.nombre || '?').charAt(0).toUpperCase();

  if (src) {
    return (
      <img
        src={src}
        alt=""
        className="user-avatar user-avatar--img"
        width={size}
        height={size}
        loading="lazy"
        decoding="async"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <span
      className="user-avatar user-avatar--fallback"
      style={{ width: size, height: size, fontSize: size * 0.38 }}
      aria-hidden
    >
      {initial}
    </span>
  );
}

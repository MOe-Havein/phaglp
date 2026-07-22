"use client";

import { getThemeAssets } from "@/packages/admin-theme/theme.assets";

type Props = {
  themeId: string;
};

export function AdminThemeAssets({ themeId }: Props) {
  const assets = getThemeAssets(themeId);

  return (
    <>
      {assets.css.map((href) => (
        <link key={href} rel="stylesheet" href={href} />
      ))}
      {assets.js.map((src) => (
        <script key={src} src={src} />
      ))}
    </>
  );
}

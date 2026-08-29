import type { SVGProps } from 'react'

/**
 * One small hand-drawn icon set rather than a dependency.
 *
 * All icons share a 24 unit grid, a 1.6 stroke, round caps and `currentColor`,
 * so they sit together without looking assembled from different libraries.
 */

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

function Icon({ size = 20, children, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  )
}

export const HomeIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-4v-5h-6v5H5a1 1 0 0 1-1-1z" />
  </Icon>
)

export const TrainIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="8.2" />
    <path d="M12 7.4v4.9l3.1 2" />
  </Icon>
)

export const WordsIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5 4.8h9.2a2.8 2.8 0 0 1 2.8 2.8V20H7.8A2.8 2.8 0 0 1 5 17.2z" />
    <path d="M8.6 9.2h5.2M8.6 12.8h3.4" />
    <path d="M17 4.8h2v13.4" />
  </Icon>
)

export const ProgressIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 19h16" />
    <path d="M6.5 15.4 10.6 10l3.2 3.1L19 6.6" />
    <circle cx="10.6" cy="10" r="1.1" fill="currentColor" stroke="none" />
    <circle cx="13.8" cy="13.1" r="1.1" fill="currentColor" stroke="none" />
  </Icon>
)

export const ProfileIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="8.6" r="3.4" />
    <path d="M5.4 19.4a6.8 6.8 0 0 1 13.2 0" />
  </Icon>
)

export const ArrowLeftIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M15 5.5 8 12l7 6.5" />
  </Icon>
)

export const ArrowRightIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M9 5.5 16 12l-7 6.5" />
  </Icon>
)

export const CheckIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5 12.6 9.6 17 19 7.4" />
  </Icon>
)

export const CloseIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Icon>
)

export const SearchIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="11" cy="11" r="6.2" />
    <path d="m15.6 15.6 3.6 3.6" />
  </Icon>
)

export const PlusIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 5.5v13M5.5 12h13" />
  </Icon>
)

export const SoundIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5 9.5h3l4-3.2v11.4l-4-3.2H5z" />
    <path d="M15.4 9.4a3.6 3.6 0 0 1 0 5.2" />
    <path d="M17.9 7.2a7 7 0 0 1 0 9.6" />
  </Icon>
)

export const MicIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="9.2" y="3.4" width="5.6" height="10.4" rx="2.8" />
    <path d="M5.8 11.6a6.2 6.2 0 0 0 12.4 0" />
    <path d="M12 17.8V21" />
  </Icon>
)

export const BulbIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M9.4 17.2a5.6 5.6 0 1 1 5.2 0v1.6H9.4z" />
    <path d="M10.2 21h3.6" />
  </Icon>
)

export const FlameIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 3.5s4.6 3.7 4.6 8.1a4.6 4.6 0 1 1-9.2 0c0-1.8.9-3 .9-3s.6 1.5 1.8 1.8c0-3 1.9-5.2 1.9-6.9z" />
  </Icon>
)

export const BoltIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M13.4 3.5 6.6 13h4.4l-1.4 7.5L17.4 11H13z" />
  </Icon>
)

export const SparkIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 4v4M12 16v4M4 12h4M16 12h4" />
    <path d="M12 8.6 13.2 12 12 15.4 10.8 12z" />
  </Icon>
)

export const LayersIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="m12 4 8 4-8 4-8-4z" />
    <path d="m4 13 8 4 8-4" />
  </Icon>
)

export const ReturnIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4.5 11.5A7.5 7.5 0 1 1 12 19.5H7" />
    <path d="m9.5 17-2.5 2.5L9.5 22" />
  </Icon>
)

export const GaugeIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4.4 17a8 8 0 1 1 15.2 0" />
    <path d="m12 13.6 3.6-3.8" />
    <circle cx="12" cy="15" r="1.3" />
  </Icon>
)

export const GridIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="4.5" y="4.5" width="6" height="6" rx="1.2" />
    <rect x="13.5" y="4.5" width="6" height="6" rx="1.2" />
    <rect x="4.5" y="13.5" width="6" height="6" rx="1.2" />
    <rect x="13.5" y="13.5" width="6" height="6" rx="1.2" />
  </Icon>
)

export const CircleCheckIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="8.2" />
    <path d="m8.4 12.2 2.5 2.5 4.7-5" />
  </Icon>
)

export const ArrowUpIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 19V5.6M6.4 11.2 12 5.6l5.6 5.6" />
  </Icon>
)

export const AlertIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="8.2" />
    <path d="M12 8v4.6" />
    <circle cx="12" cy="16" r="0.9" fill="currentColor" stroke="none" />
  </Icon>
)

export const OfflineIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 5l16 14" />
    <path d="M6.6 10.4a9 9 0 0 1 3-1.8M2.6 7.4A13 13 0 0 1 7 4.9M17.3 10.3a9 9 0 0 0-2.5-1.6M21.4 7.4a13 13 0 0 0-4.6-2.6" />
    <path d="M9.4 14a5 5 0 0 1 5.2.3" />
    <circle cx="12" cy="18" r="1" fill="currentColor" stroke="none" />
  </Icon>
)

export const SettingsIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="2.8" />
    <path d="M12 3.6v2.2M12 18.2v2.2M20.4 12h-2.2M5.8 12H3.6M17.9 6.1l-1.6 1.6M7.7 16.3l-1.6 1.6M17.9 17.9l-1.6-1.6M7.7 7.7 6.1 6.1" />
  </Icon>
)

export const TrashIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5 7h14M9.5 7V5.4A1.4 1.4 0 0 1 11 4h2a1.4 1.4 0 0 1 1.4 1.4V7" />
    <path d="M6.8 7 7.6 19a1.4 1.4 0 0 0 1.4 1.3h6a1.4 1.4 0 0 0 1.4-1.3L17.2 7" />
  </Icon>
)

export const DownloadIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 4v10.5M7.6 10.6 12 15l4.4-4.4" />
    <path d="M5 19h14" />
  </Icon>
)

export const UploadIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 15.5V5M7.6 8.9 12 4.5l4.4 4.4" />
    <path d="M5 19h14" />
  </Icon>
)

export const ChevronRightIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="m10 6.5 5.5 5.5L10 17.5" />
  </Icon>
)

export const LogoutIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M14 6.4V5a1.4 1.4 0 0 0-1.4-1.4H6.4A1.4 1.4 0 0 0 5 5v14a1.4 1.4 0 0 0 1.4 1.4h6.2A1.4 1.4 0 0 0 14 19v-1.4" />
    <path d="M10.5 12h9.2M16.6 8.9l3.1 3.1-3.1 3.1" />
  </Icon>
)

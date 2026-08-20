/**
 * Subtopic Icons — maps each subtopic ID to a meaningful Lucide icon.
 * Used on the Subtopics page and Subtopic Practice page to visually
 * distinguish subtopics at a glance.
 */
import {
  TrendingUp,
  Percent,
  Scale,
  Calculator,
  Clock,
  Route,
  Hash,
  Dice5,
  Landmark,
  ChartNoAxesCombined,
  Equal,
  BarChart3,
  GitBranch,
  Users,
  Heart,
  Binary,
  Compass,
  Puzzle,
  ListOrdered,
  BookOpen,
  PenTool,
  Eye,
  Type,
  Shuffle,
  CircleAlert,
} from "lucide-react";

function InequalityIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <path d="m5 12 7-7 7 7" />
      <path d="m5 19 7-7 7 7" />
    </svg>
  );
}

const SUBTOPIC_ICON_MAP = {
  "quant-1": TrendingUp,
  "quant-2": Percent,
  "quant-3": Scale,
  "quant-4": Clock,
  "quant-5": Route,
  "quant-6": Calculator,
  "quant-7": Hash,
  "quant-8": Dice5,
  "quant-9": Landmark,
  "quant-10": ChartNoAxesCombined,
  "quant-11": Equal,
  "quant-12": BarChart3,
  "log-1": GitBranch,
  "log-2": Users,
  "log-3": Heart,
  "log-4": Binary,
  "log-5": Compass,
  "log-6": Puzzle,
  "log-7": InequalityIcon,
  "log-8": ListOrdered,
  "ver-1": BookOpen,
  "ver-2": PenTool,
  "ver-3": Eye,
  "ver-4": Type,
  "ver-5": Shuffle,
  "ver-6": CircleAlert,
};

export function getSubtopicIcon(subtopicId) {
  return SUBTOPIC_ICON_MAP[subtopicId] ?? null;
}

export default SUBTOPIC_ICON_MAP;

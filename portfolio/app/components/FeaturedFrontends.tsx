import { featuredFrontends } from "@/lib/featured-frontends";
import FrontendCard from "./FrontendCard";

export default function FeaturedFrontends() {
  return (
    <div className="project-grid">
      {featuredFrontends.map((frontend) => (
        <FrontendCard key={frontend.slug} frontend={frontend} />
      ))}
    </div>
  );
}

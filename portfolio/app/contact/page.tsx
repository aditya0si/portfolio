import type { Metadata } from "next";
import ContactInfo from "../components/ContactInfo";

export const metadata: Metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return <ContactInfo headingLevel="h1" />;
}

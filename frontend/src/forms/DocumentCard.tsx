import type { DocumentType } from "../Types";
import { CardBlog } from "./CardBlog";

interface DocumentCardProps {
    document: DocumentType;
    subClassName?: string;
    disableZoom?: boolean; 
}

export const DocumentCard = ({ document, subClassName, disableZoom }: DocumentCardProps) => {
    return (
        <div className="mt-4 flex flex-row row-2 items-start justify-center space-x-8">
            <CardBlog
                key={document._id}
                id={document._id}
                type="document"
                subClassName={subClassName}
                bgColor="bg-primary-dark/30"
                disableZoom={disableZoom}
                currentWidth="lg:full md:w-full sm:w-full"
                title={document.title}
                author={document.author?.displayName || "Unknown Author"}
                authorId={document.author?._id}
                tags={document.tags}
                subscription={document.subscription || "AWS Cloud Club in HCMUTE University"}
                duration={document.readTime || "5 minutes"}
                views={document.views || 0}
                logoURL={document.coverImage}
            />
        </div>
    );
};

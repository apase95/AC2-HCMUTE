import { CarouselComponent } from "../components/sub/CaroselComponent";
import type { BlogType, DocumentType, ExamType } from "../Types";
import { CardBlog } from "./CardBlog";
import { DocumentCard } from "./DocumentCard";
import { ExamCard } from "./ExamCard";

interface SearchResultFormProps {
    searchTerm: string;
    filteredResults: {
        blogs: BlogType[];
        documents: DocumentType[];
        exams: ExamType[];
    };
}

export const SearchResultForm = ({ searchTerm, filteredResults }: SearchResultFormProps) => {
    const hasResults =
        filteredResults.blogs.length > 0 || filteredResults.documents.length > 0 || filteredResults.exams.length > 0;

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h2 className="text-3xl text-white font-bold">
                    Search results for <span className="text-accent">"{searchTerm}"</span>
                </h2>
                {!hasResults && <div className="text-white/60 mt-12">No results found matching your criteria.</div>}
            </div>

            {filteredResults.blogs.length > 0 && (
                <CarouselComponent title="Blogs" count={filteredResults.blogs.length}>
                    {filteredResults.blogs.map((blog) => (
                        <div key={blog._id} className="w-1/3 min-w-[300px] md:min-w-[400px] snap-start">
                            <CardBlog
                                id={blog._id}
                                type="blog"
                                bgColor="bg-primary-dark/40 h-full"
                                currentWidth="w-full"
                                title={blog.title}
                                author={blog.author?.displayName || "Unknown Author"}
                                tags={blog.tags}
                                duration={blog.readTime || "5 minutes"}
                                views={blog.views || 0}
                                logoURL={blog.coverImage || "/card-default.jpg"}
                                disableZoom={true}
                                subClassName="!hover:scale-100 hover:bg-primary-dark/80"
                            />
                        </div>
                    ))}
                </CarouselComponent>
            )}

            {filteredResults.documents.length > 0 && (
                <CarouselComponent title="Documents" count={filteredResults.documents.length}>
                    {filteredResults.documents.map((doc) => (
                        <div key={doc._id} className="max-w-[500px] md:min-w-[400px] snap-start">
                            <DocumentCard document={doc} disableZoom={true} subClassName="hover:bg-primary-dark/80" />
                        </div>
                    ))}
                </CarouselComponent>
            )}

            {filteredResults.exams.length > 0 && (
                <CarouselComponent title="Exams" count={filteredResults.exams.length}>
                    {filteredResults.exams.map((exam) => (
                        <div key={exam._id} className="w-1/3 min-w-[300px] md:min-w-[350px] snap-start">
                            <ExamCard
                                bgColor="bg-primary-dark/40 h-full"
                                currentWidth="w-full"
                                subClassName="!hover:scale-100 hover:bg-primary-dark"
                                disableZoom={true}
                                data={exam}
                            />
                        </div>
                    ))}
                </CarouselComponent>
            )}
        </div>
    );
};

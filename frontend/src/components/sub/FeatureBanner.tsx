import { CardBlog } from "../../forms/CardBlog";
import type { BlogType } from "../../Types";

interface FeatureBannerProps {
    blogs: BlogType[];
}

export const FeatureBanner = ({ blogs }: FeatureBannerProps) => {

    if (!blogs || blogs.length === 0) return null;
    const [mainBlog, subBlog1, subBlog2] = blogs;

    return (
        <div className="mt-8 flex flex-row row-2 items-start justify-center space-x-8">
            <CardBlog
                key={mainBlog._id}
                id={mainBlog._id}
                type="blog"
                currentWidth="lg:w-3/4 md:w-full sm:w-full"
                title={mainBlog.title}
                author={mainBlog.author?.displayName || "Unknown Author"}
                authorId={mainBlog.author?._id || ""}
                tags={mainBlog.tags}
                duration={mainBlog.readTime || "5 minutes"}
                views={mainBlog.views || 0}
                subscription={mainBlog.subscription || ""}
                logoURL={mainBlog.coverImage || "/card-default.jpg"}
            />
            <div className="w-[30%] flex-col space-y-2 hidden lg:flex">
                <CardBlog
                    key={subBlog1._id}
                    id={subBlog1._id}
                    type="blog"
                    currentWidth="w-full"
                    title={subBlog1.title}
                    author={subBlog1.author?.displayName || "Unknown Author"}
                    authorId={subBlog1.author?._id || ""}
                    tags={subBlog1.tags}
                    duration={subBlog1.readTime || "5 minutes"}
                    views={subBlog1.views || 0}
                    logoURL={subBlog1.coverImage || "/card-default.jpg"}
                />
                <CardBlog
                    key={subBlog2._id}
                    id={subBlog2._id}
                    type="blog"
                    currentWidth="w-full"
                    title={subBlog2.title}
                    author={subBlog2.author?.displayName || "Unknown Author"}
                    authorId={subBlog2.author?._id || ""}
                    tags={subBlog2.tags}
                    duration={subBlog2.readTime || "5 minutes"}
                    views={subBlog2.views || 0}
                    logoURL={subBlog2.coverImage || "/card-default.jpg"}
                />
            </div>
        </div>
    );
};

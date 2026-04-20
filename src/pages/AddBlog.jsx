import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import BlogHeader from '../components/add-blog/BlogHeader';
import BlogEditor from '../components/add-blog/BlogEditor';
import AuthorDetails from '../components/add-blog/AuthorDetails';
import PublishingSettings from '../components/add-blog/PublishingSettings';
import BlogImageUpload from '../components/add-blog/BlogImageUpload';
import SEOTags from '../components/add-blog/SEOTags';
import BlogActions from '../components/add-blog/BlogActions';

const categoryOptions = [
    { value: 'Market Insights', label: 'Market Insights' },
    { value: 'Buying Guide', label: 'Buying Guide' },
    { value: 'Investment', label: 'Investment' },
    { value: 'Lifestyle', label: 'Lifestyle' },
    { value: 'Real Estate News', label: 'Real Estate News' },
    { value: 'Other', label: 'Other (Add Custom)' }
];


const AddBlog = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [status, setStatus] = useState('Published');
    const [category, setCategory] = useState('');
    const [customCategory, setCustomCategory] = useState('');
    const [author, setAuthor] = useState('');
    const [authorRole, setAuthorRole] = useState('');
    const [readTime, setReadTime] = useState('');
    const [images, setImages] = useState([]);
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState('');
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleAddTag = (e) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            if (!tags.includes(tagInput.trim())) {
                setTags([...tags, tagInput.trim()]);
            }
            setTagInput('');
        }
    };

    const removeTag = (tag) => {
        setTags(tags.filter(t => t !== tag));
    };

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
            ['link', 'image', 'video'],
            ['clean']
        ],
    };

    const isFormValid =
        title.trim() !== '' &&
        content.trim() !== '' &&
        content !== '<p><br></p>' &&
        (category !== 'Other' ? category !== '' : customCategory.trim() !== '') &&
        author.trim() !== '' &&
        authorRole.trim() !== '' &&
        readTime.trim() !== '' &&
        images.length > 0;

    const handleSave = (overridingStatus = null) => {
        if (!isFormValid) {
            toast.error('Please fill in all required fields and upload a cover image.');
            return;
        }
        const finalStatus = overridingStatus || status;
        const newBlog = {
            id: id ? parseInt(id) : Date.now(),
            title: title || 'Untitled Article',
            slug: title.toLowerCase().replace(/\s+/g, '-'),
            content,
            status: finalStatus,
            category: category === 'Other' ? customCategory : (category || 'Market Insights'),
            author: author || 'Admin',
            authorRole: authorRole || 'Editor',
            readTime: readTime || '5 min read',
            images,
            tags,
            date: new Date().toISOString().split('T')[0],
            views: 0,
            featured: false
        };

        // Persistence logic for prototype
        const existingCustomBlogs = JSON.parse(localStorage.getItem('custom_blogs') || '[]');
        let updatedBlogs;
        if (id) {
            updatedBlogs = existingCustomBlogs.map(b => b.id === newBlog.id ? newBlog : b);
        } else {
            updatedBlogs = [newBlog, ...existingCustomBlogs];
        }
        localStorage.setItem('custom_blogs', JSON.stringify(updatedBlogs));

        toast.success(id ? 'Article updated successfully!' : `Article ${finalStatus === 'Published' ? 'published' : 'saved as draft'} successfully!`);
        navigate('/blogs');
    };

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            <BlogHeader
                id={id}
                onCancel={() => navigate('/blogs')}
                windowWidth={windowWidth}
            />

            <div className="mx-auto space-y-8">
                <div className="space-y-6">
                    <BlogEditor
                        title={title}
                        handleTitleChange={handleTitleChange}
                        content={content}
                        setContent={setContent}
                        modules={modules}
                    />

                    <AuthorDetails
                        author={author}
                        setAuthor={setAuthor}
                        authorRole={authorRole}
                        setAuthorRole={setAuthorRole}
                        readTime={readTime}
                        setReadTime={setReadTime}
                    />
                </div>

                <PublishingSettings
                    category={category}
                    setCategory={setCategory}
                    customCategory={customCategory}
                    setCustomCategory={setCustomCategory}
                    status={status}
                    setStatus={setStatus}
                    categoryOptions={categoryOptions}
                />

                <BlogImageUpload
                    images={images}
                    onChange={(newImages) => setImages(newImages)}
                />

                <SEOTags
                    tags={tags}
                    tagInput={tagInput}
                    setTagInput={setTagInput}
                    handleAddTag={handleAddTag}
                    removeTag={removeTag}
                />

                <BlogActions
                    handleSave={handleSave}
                    isFormValid={isFormValid}
                />
            </div>
        </div>
    );
};

export default AddBlog;

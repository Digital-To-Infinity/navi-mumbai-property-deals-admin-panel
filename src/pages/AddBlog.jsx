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
import api from '../utils/api';

const defaultCategoryOptions = [
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
    const [featured, setFeatured] = useState(false);
    const [categoryOptions, setCategoryOptions] = useState(defaultCategoryOptions);
    const [isLoadingCategories, setIsLoadingCategories] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        fetchCategories();
        if (id) {
            fetchBlog();
        }
        return () => window.removeEventListener('resize', handleResize);
    }, [id]);

    const fetchBlog = async () => {
        try {
            const response = await api.get(`/admin/blogs/${id}`);
            if (response.data?.success) {
                const blog = response.data.data;
                setTitle(blog.title);
                setContent(blog.content);
                setCategory(blog.category);
                setAuthor(blog.author);
                setAuthorRole(blog.author_role);
                setReadTime(blog.read_time);
                setStatus(blog.status);
                setFeatured(blog.featured === 1 || blog.featured === true);
                setTags(blog.tags || []);
                if (blog.cover_image_url) {
                    setImages([blog.cover_image_url]);
                }
            }
        } catch (error) {
            console.error('Failed to fetch blog:', error);
            toast.error('Failed to load blog data');
        }
    };

    const fetchCategories = async () => {
        setIsLoadingCategories(true);
        try {
            const response = await api.get('/blogs/categories');
            if (response.data?.success) {
                const apiCategories = response.data.data.map(cat => ({
                    value: cat.name,
                    label: cat.name
                }));
                // Combine default with API categories, ensuring no duplicates
                const combined = [...apiCategories];
                const seen = new Set(combined.map(c => c.value));
                
                defaultCategoryOptions.forEach(opt => {
                    if (!seen.has(opt.value)) {
                        combined.push(opt);
                    }
                });
                
                // Ensure "Other" is always at the end
                const finalOptions = combined.filter(opt => opt.value !== 'Other');
                finalOptions.push({ value: 'Other', label: 'Other (Add Custom)' });
                
                setCategoryOptions(finalOptions);
            }
        } catch (error) {
            console.error('Failed to fetch categories:', error);
            // Fallback to default options already set in state initialization
        } finally {
            setIsLoadingCategories(false);
        }
    };

    const handleAddCategory = async () => {
        if (!customCategory.trim()) {
            toast.error('Please enter a category name');
            return;
        }

        try {
            const response = await api.post('/admin/blogs/categories', { name: customCategory.trim() });
            if (response.data?.success) {
                toast.success('Category added successfully!');
                // Reset custom category and refresh list
                setCategory(customCategory.trim());
                setCustomCategory('');
                await fetchCategories();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add category');
        }
    };

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

    const handleSave = async (overridingStatus = null) => {
        if (!isFormValid) {
            toast.error('Please fill in all required fields and upload a cover image.');
            return;
        }

        const finalStatus = overridingStatus || status;
        const finalCategory = category === 'Other' ? customCategory : (category || 'Market Insights');
        
        try {
            const formData = new FormData();
            
            // Step 1: Handle image
            if (images.length > 0) {
                if (images[0].file) {
                    // New file being uploaded
                    formData.append('coverImage', images[0].file);
                } else if (typeof images[0] === 'string') {
                    // Existing image URL
                    formData.append('cover_image_url', images[0]);
                }
            }

            // Step 2: Append other fields
            formData.append('title', title || 'Untitled Article');
            formData.append('content', content);
            formData.append('category', finalCategory);
            formData.append('author', author || 'Admin');
            formData.append('author_role', authorRole || 'Editor');
            formData.append('read_time', readTime || '5 min read');
            formData.append('status', finalStatus);
            formData.append('featured', featured ? 'true' : 'false');
            formData.append('tags', JSON.stringify(tags));
            formData.append('date', new Date().toISOString().split('T')[0]);

            let response;
            if (id) {
                response = await api.put(`/admin/blogs/${id}`, formData);
            } else {
                response = await api.post('/admin/blogs', formData);
            }

            if (response.data?.success) {
                toast.success(id ? 'Article updated successfully!' : `Article ${finalStatus === 'Published' ? 'published' : 'saved as draft'} successfully!`);
                navigate('/blogs');
            }
        } catch (error) {
            toast.dismiss('uploading');
            console.error('Save error:', error);
            toast.error(error.response?.data?.message || error.message || 'Failed to save article');
        }
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
                    handleAddCategory={handleAddCategory}
                    status={status}
                    setStatus={setStatus}
                    featured={featured}
                    setFeatured={setFeatured}
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

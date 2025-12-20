import { useState, useRef, useEffect, type ChangeEvent, type DragEvent } from 'react';
import { categoryApi, type Category } from '../services/api';
import './AddPhotoModal.css';

interface AddPhotoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const AddPhotoModal = ({ isOpen, onClose, onSuccess }: AddPhotoModalProps) => {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);

    // Form data
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState<string>('');
    const [basePrice, setBasePrice] = useState('');
    const [location, setLocation] = useState('');
    const [tags, setTags] = useState('');

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Load categories when modal opens
    useEffect(() => {
        if (isOpen) {
            loadCategories();
        }
    }, [isOpen]);

    const loadCategories = async () => {
        try {
            const data = await categoryApi.getAllCategories();
            setCategories(data);
        } catch (err) {
            console.error('Failed to load categories:', err);
        }
    };

    const handleFileSelect = (selectedFile: File) => {
        // Validate file type
        if (!selectedFile.type.startsWith('image/')) {
            setError('Please select an image file');
            return;
        }

        // Validate file size (10MB max)
        if (selectedFile.size > 10 * 1024 * 1024) {
            setError('File size must be less than 10MB');
            return;
        }

        setFile(selectedFile);
        setError(null);

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(selectedFile);
    };

    const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            handleFileSelect(selectedFile);
        }
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            handleFileSelect(droppedFile);
        }
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const getCurrentUserId = (): number => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                return user.id;
            } catch (e) {
                throw new Error('Invalid user data');
            }
        }
        throw new Error('User not logged in');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!file) {
            setError('Please select a file');
            return;
        }

        if (!title || !description || !categoryId || !basePrice) {
            setError('Please fill in all required fields');
            return;
        }

        try {
            setUploading(true);
            setError(null);

            const formData = new FormData();
            formData.append('file', file);

            // Create photo data object
            const photoData = {
                title,
                description,
                photographerId: getCurrentUserId(),
                categoryIds: [parseInt(categoryId)],
                basePrice: parseFloat(basePrice),
                location: location || null,
                tagIds: []
            };

            const dataBlob = new Blob([JSON.stringify(photoData)], {
                type: 'application/json'
            });
            formData.append('data', dataBlob);

            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8080/api/v1/photos/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Upload failed' }));
                throw new Error(errorData.message || `Upload failed with status ${response.status}`);
            }

            // Success!
            onSuccess();
            handleClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to upload photo');
        } finally {
            setUploading(false);
        }
    };

    const handleClose = () => {
        setFile(null);
        setPreview(null);
        setTitle('');
        setDescription('');
        setCategoryId('');
        setBasePrice('');
        setLocation('');
        setTags('');
        setError(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Upload New Photo</h3>
                    <button className="modal-close" onClick={handleClose}>×</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        {error && (
                            <div className="alert alert-error">
                                {error}
                            </div>
                        )}

                        {/* File Upload Area */}
                        {!file ? (
                            <div
                                className="upload-zone"
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <h4>Drop your image here or click to browse</h4>
                                <p>Supports: JPG, PNG (Max 10MB)</p>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileInputChange}
                                    style={{ display: 'none' }}
                                />
                            </div>
                        ) : (
                            <div className="upload-preview">
                                <img src={preview!} alt="Preview" />
                                <button
                                    type="button"
                                    className="btn btn-ghost btn-sm"
                                    onClick={() => {
                                        setFile(null);
                                        setPreview(null);
                                    }}
                                >
                                    Change Image
                                </button>
                                <p className="file-info">{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</p>
                            </div>
                        )}

                        {/* Photo Details Form */}
                        {file && (
                            <div className="photo-form">
                                <div className="form-group">
                                    <label>Title *</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Enter photo title"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Description *</label>
                                    <textarea
                                        className="form-input"
                                        rows={3}
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Describe your photo"
                                        required
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Category *</label>
                                        <select
                                            className="form-input"
                                            value={categoryId}
                                            onChange={(e) => setCategoryId(e.target.value)}
                                            required
                                        >
                                            <option value="">Select category</option>
                                            {categories.map((cat) => (
                                                <option key={cat.id} value={cat.id}>
                                                    {cat.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Base Price ($) *</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            className="form-input"
                                            value={basePrice}
                                            onChange={(e) => setBasePrice(e.target.value)}
                                            placeholder="0.00"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Location</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        placeholder="e.g., Yala National Park"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Tags (comma-separated)</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={tags}
                                        onChange={(e) => setTags(e.target.value)}
                                        placeholder="e.g., elephant, wildlife, nature"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-ghost"
                            onClick={handleClose}
                            disabled={uploading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={!file || uploading}
                        >
                            {uploading ? (
                                <>
                                    <svg className="spinner" width="16" height="16" viewBox="0 0 24 24" fill="none">
                                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                                        <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                                    </svg>
                                    Uploading...
                                </>
                            ) : (
                                'Upload Photo'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPhotoModal;

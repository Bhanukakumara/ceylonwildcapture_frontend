import { useState, useEffect } from 'react';
import { photoApi, categoryApi, type Photo, type Category } from '../services/api';
import { Button, Input, Title } from './ui';
import './AddPhotoModal.css';

interface EditPhotoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    photo: Photo;
}

const EditPhotoModal = ({ isOpen, onClose, onSuccess, photo }: EditPhotoModalProps) => {
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);

    // Form data - initialized with photo data
    const [title, setTitle] = useState(photo.title);
    const [description, setDescription] = useState(photo.description || '');
    const [categoryIds, setCategoryIds] = useState<number[]>([]);
    const [basePrice, setBasePrice] = useState(photo.basePrice.toString());
    const [location, setLocation] = useState(photo.location || '');
    const [cameraModel, setCameraModel] = useState(photo.cameraModel || '');
    const [lens, setLens] = useState(photo.lens || '');
    const [focalLength, setFocalLength] = useState(photo.focalLength || '');
    const [aperture, setAperture] = useState(photo.aperture || '');
    const [shutterSpeed, setShutterSpeed] = useState(photo.shutterSpeed || '');
    const [iso, setIso] = useState(photo.iso || '');
    const [captureDate, setCaptureDate] = useState(photo.captureDate || '');

    // Load categories and initialize selected categories
    useEffect(() => {
        if (isOpen) {
            loadCategories();
            // Reset form with photo data when modal opens
            setTitle(photo.title);
            setDescription(photo.description || '');
            setBasePrice(photo.basePrice.toString());
            setLocation(photo.location || '');
            setCameraModel(photo.cameraModel || '');
            setLens(photo.lens || '');
            setFocalLength(photo.focalLength || '');
            setAperture(photo.aperture || '');
            setShutterSpeed(photo.shutterSpeed || '');
            setIso(photo.iso || '');
            setCaptureDate(photo.captureDate || '');
            setError(null);

            // Extract category IDs from photo
            if (Array.isArray(photo.categories)) {
                setCategoryIds(photo.categories.map(cat => cat.id));
            }
        }
    }, [isOpen, photo]);

    const loadCategories = async () => {
        try {
            const data = await categoryApi.getAllCategories();
            setCategories(data);
        } catch (err) {
            console.error('Failed to load categories:', err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title || !basePrice) {
            setError('Please fill in all required fields (Title and Base Price)');
            return;
        }

        if (categoryIds.length === 0) {
            setError('Please select a category');
            return;
        }

        try {
            setUpdating(true);
            setError(null);

            const photoData = {
                title,
                description: description || undefined,
                categoryIds,
                basePrice: parseFloat(basePrice),
                location: location || undefined,
                cameraModel: cameraModel || undefined,
                lens: lens || undefined,
                focalLength: focalLength || undefined,
                aperture: aperture || undefined,
                shutterSpeed: shutterSpeed || undefined,
                iso: iso || undefined,
                captureDate: captureDate || undefined,
            };

            await photoApi.updatePhoto(photo.id, photoData);

            // Success!
            onSuccess();
            onClose();
        } catch (err: any) {
            console.error('Update error:', err);
            console.error('Error response:', err.response?.data);
            const errorMessage = err.response?.data?.message || err.message || 'Failed to update photo';
            setError(errorMessage);
        } finally {
            setUpdating(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="modal-header">
                        <Title level={3}>Edit Photo</Title>
                        <Button variant="ghost" className="modal-close" onClick={onClose}>×</Button>
                    </div>

                    <div className="modal-body">
                        {error && (
                            <div className="alert alert-error">
                                {error}
                            </div>
                        )}

                        {/* Photo Preview */}
                        <div className="upload-preview">
                            <img src={photo.thumbnailUrl} alt={photo.title} />
                            <p className="file-info">{photo.width}×{photo.height} • {photo.format.toUpperCase()}</p>
                        </div>

                        {/* Photo Details Form */}
                        <div className="photo-form">
                            <div className="form-group">
                                <label htmlFor="title">Title *</label>
                                <Input
                                    id="title"
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="description">Description</label>
                                <textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={4}
                                />
                            </div>

                            <div className="form-divider">Pricing</div>

                            <div className="form-group">
                                <label htmlFor="basePrice">Price * ($)</label>
                                <Input
                                    id="basePrice"
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    value={basePrice}
                                    onChange={(e) => setBasePrice(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-divider">Location & Category</div>

                            <div className="form-group">
                                <label htmlFor="location">Location</label>
                                <Input
                                    id="location"
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="e.g., Yala National Park"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="category">Category *</label>
                                <select
                                    id="category"
                                    className="form-input"
                                    value={categoryIds[0] || ''}
                                    onChange={(e) => setCategoryIds(e.target.value ? [parseInt(e.target.value)] : [])}
                                    required
                                >
                                    <option value="">Select a category</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-divider">EXIF Data</div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="captureDate">Capture Date</label>
                                    <input
                                        id="captureDate"
                                        type="datetime-local"
                                        className="form-input"
                                        value={captureDate}
                                        onChange={(e) => setCaptureDate(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="cameraModel">Camera Model</label>
                                    <Input
                                        id="cameraModel"
                                        type="text"
                                        value={cameraModel}
                                        onChange={(e) => setCameraModel(e.target.value)}
                                        placeholder="e.g., Canon EOS R5"
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="lens">Lens</label>
                                    <Input
                                        id="lens"
                                        type="text"
                                        value={lens}
                                        onChange={(e) => setLens(e.target.value)}
                                        placeholder="e.g., 100-400mm f/4.5-5.6"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="focalLength">Focal Length</label>
                                    <Input
                                        id="focalLength"
                                        type="text"
                                        value={focalLength}
                                        onChange={(e) => setFocalLength(e.target.value)}
                                        placeholder="e.g., 400mm"
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="aperture">Aperture</label>
                                    <Input
                                        id="aperture"
                                        type="text"
                                        value={aperture}
                                        onChange={(e) => setAperture(e.target.value)}
                                        placeholder="e.g., f/5.6"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="shutterSpeed">Shutter Speed</label>
                                    <Input
                                        id="shutterSpeed"
                                        type="text"
                                        value={shutterSpeed}
                                        onChange={(e) => setShutterSpeed(e.target.value)}
                                        placeholder="e.g., 1/1000"
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="iso">ISO</label>
                                    <Input
                                        id="iso"
                                        type="text"
                                        value={iso}
                                        onChange={(e) => setIso(e.target.value)}
                                        placeholder="e.g., 800"
                                    />
                                </div>
                                <div className="form-group">
                                    {/* Empty div for grid alignment */}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <Button type="button" variant="ghost" onClick={onClose} disabled={updating}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" disabled={updating}>
                            {updating ? 'Updating...' : 'Update Photo'}
                        </Button>
                    </div>
                </form>
            </div >
        </div >
    );
};

export default EditPhotoModal;

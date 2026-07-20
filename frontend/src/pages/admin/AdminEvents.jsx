import { useState, useEffect } from 'react';
import { eventsAPI } from '../../api';
import Modal from '../../components/Modal';
import './AdminPages.css';
import uploadImage from '../../helpers/uploadImage';
const emptyForm = { title: '', description: '', url: '', image: null };

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const fetchEvents = () => {
    eventsAPI
      .getAll()
      .then((res) => {
        const sorted = [...res.data].sort(
          (a, b) => (new Date(b.createdAt || 0) - new Date(a.createdAt || 0)) || b._id.localeCompare(a._id)
        );
        setEvents(sorted);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(fetchEvents, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setPreview(null);
    setError('');
    setUploadingImage(false);
    setModalOpen(true);
  };

  const openEdit = (event) => {
    setEditing(event);
    setForm({ title: event.title, description: event.description, url: event.url || '', image: null });
    setPreview(event.image);
    setError('');
    setUploadingImage(false);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
    setForm(emptyForm);
    setPreview(null);
    setError('');
    setUploadingImage(false);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setUploadingImage(true);
      setError('');
      try {
        const image = await uploadImage(file);
        if (image) {
          setForm({ ...form, image: image });
        } else {
          setError('Failed to upload image to Cloudinary.');
        }
      } catch (err) {
        console.error(err);
        setError('Error uploading image.');
      } finally {
        setUploadingImage(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (uploadingImage) {
      setError('Please wait for the image to finish uploading.');
      return;
    }
    setError('');
    setSubmitting(true);

    const payload = {
      title: form.title,
      description: form.description,
      url: form.url,
    };
    if (form.image) {
      payload.image = form.image;
    }

    try {
      if (editing) {
        await eventsAPI.update(editing._id, payload);
      } else {
        if (!payload.image) {
          setError('Please select an event image.');
          setSubmitting(false);
          return;
        }
        await eventsAPI.create(payload);
      }
      fetchEvents();
      closeModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save event.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this event?')) return;
    try {
      await eventsAPI.delete(id);
      fetchEvents();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete event.');
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1>Events</h1>
          <p>Manage MLSA events displayed on the public site.</p>
        </div>
        <button onClick={openCreate} className="btn btn-primary">
          + Add Event
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading events...</div>
      ) : events.length === 0 ? (
        <div className="empty-state card">
          <h3>No events yet</h3>
          <p>Click "Add Event" to create your first event.</p>
        </div>
      ) : (
        <div className="card admin-table-card">
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>URL</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event._id}>
                    <td>
                      <img src={event.image} alt={event.title} className="table-thumb" />
                    </td>
                    <td className="table-title">{event.title?.length > 10 ? event.title.slice(0, 10) + '...' : event.title}</td>
                    <td className="table-desc">{event.description}</td>
                    <td>
                      {event.url ? (
                        <a href={event.url} target="_blank" rel="noopener noreferrer">
                          Link
                        </a>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="table-actions">
                      <button onClick={() => openEdit(event)} className="btn btn-secondary btn-sm">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(event._id)} className="btn btn-danger btn-sm">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {modalOpen && (
        <Modal title={editing ? 'Edit Event' : 'Add Event'} onClose={closeModal}>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  id="title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="url">URL (optional)</label>
                <input
                  id="url"
                  type="url"
                  value={form.url}
                  onChange={(e) => setForm({ ...form, url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div className="form-group">
                <label htmlFor="image">Image {!editing && '(required)'}</label>
                <input id="image" type="file" accept="image/*" onChange={handleImageChange} />
                {uploadingImage && <p className="uploading-text" style={{ color: '#0078d4', fontSize: '14px', margin: '5px 0' }}>Uploading image to Cloudinary...</p>}
                {preview && <img src={preview} alt="Preview" className="image-preview" />}
              </div>
              {error && <p className="form-error">{error}</p>}
            </div>
            <div className="modal-footer">
              <button type="button" onClick={closeModal} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting || uploadingImage}>
                {submitting ? 'Saving...' : uploadingImage ? 'Uploading...' : editing ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

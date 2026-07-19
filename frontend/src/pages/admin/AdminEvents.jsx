import { useState, useEffect } from 'react';
import { eventsAPI } from '../../api';
import Modal from '../../components/Modal';
import './AdminPages.css';

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

  const fetchEvents = () => {
    eventsAPI
      .getAll()
      .then((res) => setEvents(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(fetchEvents, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setPreview(null);
    setError('');
    setModalOpen(true);
  };

  const openEdit = (event) => {
    setEditing(event);
    setForm({ title: event.title, description: event.description, url: event.url || '', image: null });
    setPreview(event.image);
    setError('');
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
    setForm(emptyForm);
    setPreview(null);
    setError('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('url', form.url);
    if (form.image) formData.append('image', form.image);

    try {
      if (editing) {
        await eventsAPI.update(editing._id, formData);
      } else {
        if (!form.image) {
          setError('Please select an event image.');
          setSubmitting(false);
          return;
        }
        await eventsAPI.create(formData);
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
        <div className="admin-table-wrap card">
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
                  <td className="table-title">{event.title}</td>
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
                {preview && <img src={preview} alt="Preview" className="image-preview" />}
              </div>
              {error && <p className="form-error">{error}</p>}
            </div>
            <div className="modal-footer">
              <button type="button" onClick={closeModal} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Saving...' : editing ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { teamAPI } from '../../api';
import Modal from '../../components/Modal';
import './AdminPages.css';
import uploadImage from '../../helpers/uploadImage';
const emptyForm = { name: '', designation: '', image: null };

export default function AdminTeam() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const fetchMembers = () => {
    teamAPI
      .getAll()
      .then((res) => setMembers(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(fetchMembers, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setPreview(null);
    setError('');
    setUploadingImage(false);
    setModalOpen(true);
  };

  const openEdit = (member) => {
    setEditing(member);
    setForm({ name: member.name, designation: member.designation, image: null });
    setPreview(member.image);
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
          console.log('Uploaded image URL:', image);
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
      name: form.name,
      designation: form.designation,
    };
    if (form.image) {
      payload.image = form.image;
    }

    try {
      if (editing) {
        await teamAPI.update(editing._id, payload);
      } else {
        if (!payload.image) {
          setError('Please select a member photo.');
          setSubmitting(false);
          return;
        }
        await teamAPI.create(payload);
      }
      fetchMembers();
      closeModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save team member.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this team member?')) return;
    try {
      await teamAPI.delete(id);
      fetchMembers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete team member.');
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1>Team Members</h1>
          <p>Manage MLSA ambassadors displayed on the public site.</p>
        </div>
        <button onClick={openCreate} className="btn btn-primary">
          + Add Member
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading team members...</div>
      ) : members.length === 0 ? (
        <div className="empty-state card">
          <h3>No team members yet</h3>
          <p>Click "Add Member" to add your first ambassador.</p>
        </div>
      ) : (
        <div className="card admin-table-card">
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Photo</th>
                  <th>Name</th>
                  <th>Designation</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member._id}>
                    <td>
                      <img src={member.image} alt={member.name} className="table-thumb round" />
                    </td>
                    <td className="table-title">{member.name}</td>
                    <td>{member.designation}</td>
                    <td className="table-actions">
                      <button onClick={() => openEdit(member)} className="btn btn-secondary btn-sm">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(member._id)} className="btn btn-danger btn-sm">
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
        <Modal title={editing ? 'Edit Team Member' : 'Add Team Member'} onClose={closeModal}>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="designation">Designation</label>
                <input
                  id="designation"
                  value={form.designation}
                  onChange={(e) => setForm({ ...form, designation: e.target.value })}
                  placeholder="e.g. Lead Ambassador"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="image">Photo {!editing && '(required)'}</label>
                <input id="image" type="file" accept="image/*" onChange={handleImageChange} />
                {uploadingImage && <p className="uploading-text" style={{ color: '#0078d4', fontSize: '14px', margin: '5px 0' }}>Uploading image to Cloudinary...</p>}
                {preview && <img src={preview} alt="Preview" className="image-preview round" />}
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

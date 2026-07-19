import { useState, useEffect } from 'react';
import { eventsAPI, teamAPI } from '../api';
import './Home.css';

export default function Home() {
  const [events, setEvents] = useState([]);
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([eventsAPI.getAll(), teamAPI.getAll()])
      .then(([eventsRes, teamRes]) => {
        setEvents(eventsRes.data);
        setTeam(teamRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="home">
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Microsoft Learn Student Ambassadors</h1>
            <p>
              Empowering students to lead, learn, and build with Microsoft technologies.
              Join our community of innovators and changemakers.
            </p>
          </div>
        </div>
      </section>

      {/* <section id="events" className="section">
        <div className="container">
          <h2 className="section-title">Upcoming Events</h2>
          {loading ? (
            <div className="loading">Loading events...</div>
          ) : events.length === 0 ? (
            <div className="empty-state card">
              <h3>No events yet</h3>
              <p>Check back soon for upcoming MLSA events.</p>
            </div>
          ) : (
            <div className="events-grid">
              {events.map((event) => (
                <article key={event._id} className="event-card card">
                  <div className="event-image">
                    <img src={event.image} alt={event.title} />
                  </div>
                  <div className="event-body">
                    <h3>{event.title}</h3>
                    <p>{event.description}</p>
                    {event.url && (
                      <a
                        href={event.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="event-link"
                      >
                        Learn more →
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="team" className="section section-alt">
        <div className="container">
          <h2 className="section-title">Our Team</h2>
          {loading ? (
            <div className="loading">Loading team...</div>
          ) : team.length === 0 ? (
            <div className="empty-state card">
              <h3>No team members yet</h3>
              <p>Meet our ambassadors soon.</p>
            </div>
          ) : (
            <div className="team-grid">
              {team.map((member) => (
                <article key={member._id} className="team-card card">
                  <div className="team-avatar">
                    <img src={member.image} alt={member.name} />
                  </div>
                  <h3>{member.name}</h3>
                  <p className="team-designation">{member.designation}</p>
                </article>
              ))}
            </div>
          )}
        </div>
      </section> */}

      <footer className="footer">
        <div className="container">
          <p>© {new Date().getFullYear()} Microsoft Learn Student Ambassadors. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}

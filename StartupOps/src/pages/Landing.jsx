import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useRole, ROLES } from '../contexts/RoleContext';
import { ArrowRight, User, Users, Briefcase, FileText, CheckSquare, Layers, MessageSquare, Play } from 'lucide-react';
import './landing.css';

export default function Landing() {
    const navigate = useNavigate();
    const { setRole } = useRole();

    const handleEnter = (role) => {
        setRole(role);
        // Redirect based on role
        if (role === ROLES.MENTOR) {
            navigate('/overview');
        } else {
            navigate('/dashboard');
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-body)', fontFamily: 'var(--font-sans)', color: 'var(--text-main)' }}>

            {/* Navbar */}
            <nav style={{ padding: '1.5rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', borderBottom: '1px solid var(--border)' }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 700, fontSize: '1.25rem', color: 'var(--text-main)' }}>
                    <div style={{ width: '32px', height: '32px', background: 'var(--primary)', borderRadius: '8px' }}></div>
                    StartupOps
                </Link>
                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <a href="#" className="hidden md:block text-sm font-medium text-muted hover:text-main">Features</a>
                    <a href="#" className="hidden md:block text-sm font-medium text-muted hover:text-main">Pricing</a>
                    <a href="#" className="hidden md:block text-sm font-medium text-muted hover:text-main">Resources</a>
                    <Button onClick={() => handleEnter(ROLES.FOUNDER)}>Get Started</Button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content animate-fade-in">
                    <div style={{ display: 'inline-block', padding: '0.25rem 0.75rem', background: 'var(--bg-surface)', color: 'var(--primary)', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600, marginBottom: '1.5rem', border: '1px solid var(--border)' }}>
                        V2.0 IS NOW LIVE
                    </div>
                    <h1 style={{ fontSize: '3.5rem', lineHeight: '1.1', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1.5rem' }}>
                        Digital Infrastructure for <span style={{ color: 'var(--primary)' }}>Early-Stage Founders</span>
                    </h1>
                    <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '2.5rem' }}>
                        One workspace to manage your documents, team, and mentorship. Built to scale with your vision from day zero.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <Button onClick={() => handleEnter(ROLES.FOUNDER)} style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}>Launch Workspace</Button>
                        <Button icon={Play} style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}>Watch Demo</Button>
                    </div>

                    <div style={{ marginTop: '3rem' }}>
                        <p className="text-xs text-muted uppercase tracking-wider mb-4 font-semibold" style={{ color: 'var(--text-secondary)' }}>Trusted by builders from</p>
                        <div style={{ display: 'flex', gap: '2rem', opacity: 0.6, filter: 'grayscale(100%) brightness(1.5)' }}>
                            <span style={{ fontWeight: 700 }}>Y Combinator</span>
                            <span style={{ fontWeight: 700 }}>Techstars</span>
                            <span style={{ fontWeight: 700 }}>500</span>
                        </div>
                    </div>
                </div>

                {/* Hero Image Mockup */}
                <div className="hero-image animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <div style={{
                        background: 'var(--bg-surface)',
                        padding: '1rem',
                        borderRadius: 'var(--radius-xl)',
                        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.3), 0 8px 10px -6px rgb(0 0 0 / 0.3)',
                        border: '1px solid var(--border)',
                        transform: 'perspective(1000px) rotateY(-5deg) rotateX(2deg)',
                        transition: 'transform 0.5s ease'
                    }}
                        className="hero-card"
                    >
                        {/* Fake UI */}
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#EF4444' }}></div>
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#F59E0B' }}></div>
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981' }}></div>
                        </div>
                        <div style={{ background: 'var(--bg-body)', borderRadius: 'var(--radius-md)', padding: '1.5rem', color: 'var(--text-main)', border: '1px solid var(--border)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                <div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>MRR Growth</div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>$12,450 <span style={{ fontSize: '0.875rem', color: 'var(--success)' }}>+12%</span></div>
                                </div>
                                <div style={{ padding: '0.5rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)' }}>
                                    <Layers size={20} />
                                </div>
                            </div>
                            <div style={{ height: '4px', background: 'var(--bg-surface)', borderRadius: '2px', marginBottom: '1rem' }}>
                                <div style={{ height: '100%', width: '70%', background: 'var(--primary)', borderRadius: '2px' }}></div>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                <span>Active Tasks: 14</span>
                                <span>Pending Feedback: 3</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Role Cards Section */}
            <section style={{ padding: '4rem 2rem', background: 'var(--bg-body)' }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-main)' }}>Tailored Workspace Experiences</h2>
                        <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)' }}>Choose your entry point to access specialized operational tools.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>

                        {/* Founder Hub */}
                        <div style={{ background: 'var(--bg-surface)', padding: '2rem', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)' }}>
                            <div style={{ width: '48px', height: '48px', background: 'var(--primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--bg-body)', marginBottom: '1.5rem' }}>
                                <Briefcase size={24} />
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-main)' }}>Founder Hub</h3>
                            <p style={{ marginBottom: '2rem', lineHeight: '1.6', color: 'var(--text-secondary)' }}>Build your foundation. Manage equity, hiring, cap tables, and investor relations from one command center.</p>
                            <button
                                onClick={() => handleEnter(ROLES.FOUNDER)}
                                style={{ width: '100%', padding: '0.75rem', background: 'var(--primary)', color: 'var(--bg-body)', borderRadius: 'var(--radius-md)', fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                            >
                                Enter Workspace <ArrowRight size={16} />
                            </button>
                        </div>

                        {/* Team Portal */}
                        <div style={{ background: 'var(--bg-surface)', padding: '2rem', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)' }}>
                            <div style={{ width: '48px', height: '48px', background: '#6366F1', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', marginBottom: '1.5rem' }}>
                                <Users size={24} />
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-main)' }}>Team Portal</h3>
                            <p style={{ marginBottom: '2rem', lineHeight: '1.6', color: 'var(--text-secondary)' }}>Execute with clarity. Access daily tasks, internal resources, and cross-functional team workflows without the noise.</p>
                            <button
                                onClick={() => handleEnter(ROLES.TEAM)}
                                style={{ width: '100%', padding: '0.75rem', background: 'var(--primary)', color: 'var(--bg-body)', borderRadius: 'var(--radius-md)', fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                            >
                                Enter Workspace <ArrowRight size={16} />
                            </button>
                        </div>

                        {/* Mentor Access */}
                        <div style={{ background: 'var(--bg-surface)', padding: '2rem', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)' }}>
                            <div style={{ width: '48px', height: '48px', background: '#10B981', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', marginBottom: '1.5rem' }}>
                                <MessageSquare size={24} />
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-main)' }}>Mentor Access</h3>
                            <p style={{ marginBottom: '2rem', lineHeight: '1.6', color: 'var(--text-secondary)' }}>Provide guidance effectively. Review company progress and share strategic insights with direct documentation collaboration.</p>
                            <button
                                onClick={() => handleEnter(ROLES.MENTOR)}
                                style={{ width: '100%', padding: '0.75rem', background: 'var(--primary)', color: 'var(--bg-body)', borderRadius: 'var(--radius-md)', fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                            >
                                Enter Workspace <ArrowRight size={16} />
                            </button>
                        </div>

                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section style={{ padding: '6rem 2rem', background: 'var(--bg-body)' }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
                    <div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.05em', marginBottom: '1rem', textTransform: 'uppercase' }}>The Operating System</div>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1.5rem', lineHeight: '1.2' }}>Core Infrastructure Tools Built for Scale</h2>
                        <p className="text-muted" style={{ fontSize: '1.125rem', marginBottom: '3rem', lineHeight: '1.7' }}>Everything you need to run your startup operations in one place. Stop juggling dozens of disconnected apps.</p>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                            <div>
                                <div style={{ width: '36px', height: '36px', background: '#E0F2FE', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0EA5E9', marginBottom: '1rem' }}>
                                    <FileText size={20} />
                                </div>
                                <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Document Management</h4>
                                <p className="text-sm text-muted">Securely store and share core company formation and legal docs.</p>
                            </div>
                            <div>
                                <div style={{ width: '36px', height: '36px', background: '#DBEAFE', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB', marginBottom: '1rem' }}>
                                    <CheckSquare size={20} />
                                </div>
                                <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Task Orchestration</h4>
                                <p className="text-sm text-muted">Streamline cross-team workflows and keep project roadmaps aligned.</p>
                            </div>
                            <div>
                                <div style={{ width: '36px', height: '36px', background: '#FCE7F3', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#DB2777', marginBottom: '1rem' }}>
                                    <Layers size={20} />
                                </div>
                                <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Resource Hub</h4>
                                <p className="text-sm text-muted">Centralize internal knowledge base, tool stacks, and branding.</p>
                            </div>
                            <div>
                                <div style={{ width: '36px', height: '36px', background: '#DCFCE7', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16A34A', marginBottom: '1rem' }}>
                                    <Briefcase size={20} />
                                </div>
                                <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Equity Tracking</h4>
                                <p className="text-sm text-muted">Simple cap table management and stock option tracking.</p>
                            </div>
                        </div>
                    </div>


                </div>
            </section>

            {/* Footer CTA */}
            <section style={{ padding: '6rem 2rem', background: '#1E293B', color: 'white', textAlign: 'center' }}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>Ready to build your startup's<br />operational foundation?</h2>
                <p style={{ fontSize: '1.125rem', opacity: 0.9, marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto 2.5rem', color: '#CBD5E1' }}>Join 2,500+ founders who have streamlined their day-to-day operations with StartupOps.</p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <Button style={{ background: 'white', color: '#0F172A' }}>Start Free Trial</Button>
                    <Button>Talk to Sales</Button>
                </div>
                <p style={{ fontSize: '0.75rem', opacity: 0.7, marginTop: '1.5rem', color: '#94A3B8' }}>No credit card required. Cancel anytime.</p>
            </section>

            {/* Comprehensive Footer */}
            <footer style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border)', padding: '4rem 2rem' }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '4rem' }}>

                        {/* Brand Column */}
                        <div style={{ gridColumn: 'span 2', maxWidth: '300px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--text-main)', fontSize: '1.25rem' }}>
                                <div style={{ width: '24px', height: '24px', background: 'var(--primary)', borderRadius: '6px' }}></div>
                                StartupOps
                            </div>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '2rem' }}>
                                The operating system for high-growth startups. Manage equity, team, and knowledge from day zero to IPO.
                            </p>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                {/* Social Placeholders */}
                                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--bg-body)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>𝕏</div>
                                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--bg-body)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>In</div>
                                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--bg-body)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>G</div>
                            </div>
                        </div>

                        {/* Product Column */}
                        <div>
                            <h4 style={{ fontWeight: 700, marginBottom: '1.5rem', color: 'var(--text-main)' }}>Product</h4>
                            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <li><a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.875rem' }}>Features</a></li>
                                <li><a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.875rem' }}>Pricing</a></li>
                                <li><a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.875rem' }}>Changelog</a></li>
                                <li><a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.875rem' }}>Docs</a></li>
                            </ul>
                        </div>

                        {/* Company Column */}
                        <div>
                            <h4 style={{ fontWeight: 700, marginBottom: '1.5rem', color: 'var(--text-main)' }}>Company</h4>
                            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <li><a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.875rem' }}>About Us</a></li>
                                <li><a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.875rem' }}>Careers</a></li>
                                <li><a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.875rem' }}>Blog</a></li>
                                <li><a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.875rem' }}>Contact</a></li>
                            </ul>
                        </div>

                        {/* Legal Column */}
                        <div>
                            <h4 style={{ fontWeight: 700, marginBottom: '1.5rem', color: 'var(--text-main)' }}>Legal</h4>
                            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <li><a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.875rem' }}>Privacy Policy</a></li>
                                <li><a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.875rem' }}>Terms of Service</a></li>
                                <li><a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.875rem' }}>Security</a></li>
                            </ul>
                        </div>
                    </div>

                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: '2rem', display: 'flex', flexDirection: 'column', md: { flexDirection: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        <p>&copy; {new Date().getFullYear()} StartupOps Inc. All rights reserved.</p>
                        <div style={{ display: 'flex', gap: '2rem' }}>
                            <span>Region: Global</span>
                            <span>Status: All Systems Operational</span>
                        </div>
                    </div>
                </div>
            </footer>

        </div>
    );
}

# IIT Bombay CMS

Welcome to the full-stack web application replica of the Underdale High School / IIT Bombay landing page. This project features a highly dynamic, pixel-perfect frontend designed to be completely fluid and responsive across all device sizes—from mobile screens to ultra-wide 4K monitors. It utilizes modern CSS clamping and advanced Tailwind utilities to scale the layout proportionally without relying strictly on rigid breakpoints, achieving a smooth and premium user experience.

The frontend is powered by React (via Vite) and is deeply integrated with a Node.js and Express backend. Instead of hardcoded content, the site is backed by a live MySQL database, meaning that almost all of the visual content—including the dynamic marquees, hero sections, services, and school names—are served directly via secure API endpoints. 

To manage this content, the application includes a secured Admin Dashboard. The dashboard allows administrators to dynamically update homepage text, manage active services, view contact messages, and swap out gallery images in real-time. This provides a complete Content Management System (CMS) experience straight out of the box.

## Admin Dashboard Access

To access the admin dashboard and test the live content management features, please navigate to the `/admin` route on the frontend and log in using the following credentials:

*   **Email / Username:** `Superadmin@cms`
*   **Password:** *(Use the password configured during the initial database setup, typically `admin123` or `Admin@123`)*

Once logged in, any changes saved in the dashboard will instantly reflect on the public-facing landing page.

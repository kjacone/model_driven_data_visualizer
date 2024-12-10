/** @satisfies {import('@webcontainer/api').FileSystemTree} */

export const files = {
  "index.js": {
    file: {
      contents: `
import express from 'express';
const app = express();
const port = 3000;

// Enhanced product data with images
const products = [
    {
        id: 1,
        name: 'Wireless Headphones',
        price: 99.99,
        description: 'High-quality wireless headphones with noise cancellation',
        image: '/api/placeholder/300/300'
    },
    {
        id: 2,
        name: 'Smart Watch',
        price: 199.99,
        description: 'Feature-rich smartwatch with health tracking',
        image: '/api/placeholder/300/300'
    },
    {
        id: 3,
        name: 'Laptop Backpack',
        price: 49.99,
        description: 'Durable backpack with laptop compartment',
        image: '/api/placeholder/300/300'
    }
];

// HTML template function
const createPage = (content) => \`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Express E-commerce</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                font-family: 'Arial', sans-serif;
            }

            body {
                line-height: 1.6;
                background-color: #f4f4f4;
            }

            nav {
                background-color: #333;
                padding: 1rem;
                position: sticky;
                top: 0;
                z-index: 1000;
            }

            nav ul {
                list-style: none;
                display: flex;
                justify-content: center;
                gap: 2rem;
            }

            nav a {
                color: white;
                text-decoration: none;
                font-weight: bold;
                transition: color 0.3s;
            }

            nav a:hover {
                color: #00ff9d;
            }

            .container {
                max-width: 1200px;
                margin: 0 auto;
                padding: 2rem;
            }

            .hero {
                text-align: center;
                padding: 4rem 2rem;
                background-color: #00ff9d;
                margin-bottom: 2rem;
            }

            .hero h1 {
                font-size: 2.5rem;
                margin-bottom: 1rem;
            }

            .products-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 2rem;
            }

            .product-card {
                background: white;
                border-radius: 12px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                transition: transform 0.3s, box-shadow 0.3s;
                overflow: hidden;
            }

            .product-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 6px 12px rgba(0,0,0,0.15);
            }

            .product-image {
                width: 100%;
                height: 300px;
                object-fit: cover;
                border-bottom: 1px solid #eee;
            }

            .product-info {
                padding: 1.5rem;
            }

            .product-card h3 {
                color: #333;
                margin-bottom: 0.5rem;
                font-size: 1.25rem;
            }

            .product-description {
                color: #666;
                margin-bottom: 1rem;
                font-size: 0.9rem;
            }

            .price {
                color: #00cc7e;
                font-weight: bold;
                font-size: 1.4rem;
                margin-bottom: 1rem;
            }

            .add-to-cart {
                width: 100%;
                background-color: #00cc7e;
                color: white;
                padding: 0.8rem;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                transition: background-color 0.3s;
                font-weight: bold;
            }

            .add-to-cart:hover {
                background-color: #00b36e;
            }

            .contact-form {
                max-width: 600px;
                margin: 0 auto;
                background: white;
                padding: 2rem;
                border-radius: 8px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            }

            .form-group {
                margin-bottom: 1rem;
            }

            label {
                display: block;
                margin-bottom: 0.5rem;
                color: #333;
            }

            input, textarea {
                width: 100%;
                padding: 0.8rem;
                border: 1px solid #ddd;
                border-radius: 6px;
                font-size: 1rem;
            }

            input:focus, textarea:focus {
                outline: none;
                border-color: #00cc7e;
                box-shadow: 0 0 0 2px rgba(0,204,126,0.1);
            }

            button {
                background-color: #00cc7e;
                color: white;
                padding: 0.8rem 1.5rem;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                transition: background-color 0.3s;
                font-weight: bold;
            }

            button:hover {
                background-color: #00b36e;
            }
        </style>
    </head>
    <body>
        <nav>
            <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/products">Products</a></li>
                <li><a href="/contact">Contact</a></li>
            </ul>
        </nav>
        \${content}
    </body>
    </html>
\`;

// Routes
app.get('/', (req, res) => {
    const content = \`
        <div class="hero">
            <h1>Welcome to Express E-commerce</h1>
            <p>Discover amazing products at great prices</p>
        </div>
        <div class="container">
            <h2>Featured Products</h2>
            <div class="products-grid">
                \${products.slice(0, 3).map(product => \`
                    <div class="product-card">
                        <img src="\${product.image}" alt="\${product.name}" class="product-image">
                        <div class="product-info">
                            <h3>\${product.name}</h3>
                            <p class="product-description">\${product.description}</p>
                            <p class="price">$\${product.price}</p>
                            <button class="add-to-cart" onclick="alert('Added to cart!')">Add to Cart</button>
                        </div>
                    </div>
                \`).join('')}
            </div>
        </div>
    \`;
    res.send(createPage(content));
});

app.get('/products', (req, res) => {
    const content = \`
        <div class="container">
            <h1>Our Products</h1>
            <div class="products-grid">
                \${products.map(product => \`
                    <div class="product-card">
                        <img src="\${product.image}" alt="\${product.name}" class="product-image">
                        <div class="product-info">
                            <h3>\${product.name}</h3>
                            <p class="product-description">\${product.description}</p>
                            <p class="price">$\${product.price}</p>
                            <button class="add-to-cart" onclick="alert('Added to cart!')">Add to Cart</button>
                        </div>
                    </div>
                \`).join('')}
            </div>
        </div>
    \`;
    res.send(createPage(content));
});

app.get('/contact', (req, res) => {
    const content = \`
        <div class="container">
            <h1>Contact Us</h1>
            <form class="contact-form" onsubmit="event.preventDefault(); alert('Message sent!');">
                <div class="form-group">
                    <label for="name">Name:</label>
                    <input type="text" id="name" required>
                </div>
                <div class="form-group">
                    <label for="email">Email:</label>
                    <input type="email" id="email" required>
                </div>
                <div class="form-group">
                    <label for="message">Message:</label>
                    <textarea id="message" rows="5" required></textarea>
                </div>
                <button type="submit">Send Message</button>
            </form>
        </div>
    \`;
    res.send(createPage(content));
});

app.listen(port, () => {
    console.log(\`E-commerce app listening at http://localhost:\${port}\`);
});

      `,
    },
  },
  "package.json": {
    file: {
      contents: `
{
"name": "example-app",
"version": "1.0.0",
"description": "Simple Express server",
"main": "index.js",
"type": "module",
"scripts": {
  "start": "node index.js",
  "dev": "node --watch index.js"
},
"dependencies": {
  "express": "^4.18.2"
}
}
      `,
    },
  },
  'index.html': {
    file: {
      contents: `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <link rel="icon" type="image/svg+xml" href="/vite.svg" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Vite App</title>
          </head>
          <body>
            <div id="app"></div>
            <script type="module" src="/src/main.js"></script>
          </body>
        </html>`,
    },
  },
};

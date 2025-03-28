import TOML from 'https://cdn.skypack.dev/@ltd/j-toml';

async function loadBlogList() {
    const blogListContainer = document.getElementById('blog-list');

    try {
        const response = await fetch('/blogs/list.toml');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        blogListContainer.innerHTML = '';

        const tomlText = await response.text();
        const blogs = TOML.parse(tomlText, { joiner: '\n' });

        blogs.posts.forEach(blog => {
            const blogElement = createBlogElement(blog);
            blogListContainer.appendChild(blogElement);
        });

        if (blogs.length === 0) {
            blogListContainer.innerHTML = '<p class="blog-loading">Empty</p>';
        }
    } catch (error) {
        console.error(error);
        blogListContainer.innerHTML = `<p class="blog-loading">${error.message}</p>`;
    }
}

function createBlogElement(blog) {
    const blogItem = document.createElement('div');
    blogItem.className = 'blog-item';
    blogItem.addEventListener('click', () => {
        window.location.href = `reader.html?blog=${encodeURIComponent(blog.file)}`;
    });

    blogItem.innerHTML = `
        <div class="blog-item-wrapper">
            ${blog.coverImage ? `<img src="${blog.coverImage}" alt="${blog.title}" class="blog-cover">` : ''}
            <div class="blog-content">
                <h3 class="blog-title">${blog.title}</h3>
                <p class="blog-description">${blog.description}</p>
                <div class="blog-meta">
                    <span>${blog.date}</span>
                    <span>${blog.author || '/'}</span>
                </div>
            </div>
            ${blog.tags && blog.tags.length > 0 ? `
                <div class="blog-tags-container">
                    ${blog.tags.map(tag => `<span class="blog-tag">${tag}</span>`).join('')}
                </div>
            ` : ''}
        </div>
    `;

    return blogItem;
}

document.addEventListener('DOMContentLoaded', loadBlogList);
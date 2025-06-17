homebrew/etc/nginx [ stable]
❯ ls
fastcgi.conf koi-utf nginx.conf servers
fastcgi.conf.default koi-win nginx.conf.default uwsgi_params
fastcgi_params mime.types scgi_params uwsgi_params.default
fastcgi_params.default mime.types.default scgi_params.default win-utf

homebrew/etc/nginx [ stable]
❯ nano nginx.conf

---

events {}

http {
server {
listen 80;
server_name localhost;

    # ERPNext (root path)
    location / {
      proxy_pass http://localhost:8000;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Next.js app (subpath)
    location /xylor-ai/ {
      proxy_pass http://localhost:3000;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;

      # Handle WebSocket connections for Next.js dev server
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection "upgrade";

      # Increase timeouts for better performance
      proxy_connect_timeout 60s;
      proxy_send_timeout 60s;
      proxy_read_timeout 60s;
    }

}
}

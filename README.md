# Application Load Balancer Visual

An animated, beginner-friendly explainer of the **AWS Application Load Balancer (ALB)**, told through Ravi's online shop. Plain HTML, CSS and JavaScript. No dependencies, no build step.

**#Buildwithvinit**

## The story

Ravi's shop is busy. A receptionist (the ALB) greets every visitor and sends each one to a web server that is ready, so no single server is overloaded.

## AWS ALB concepts

- **Application Load Balancer**: layer 7 balancer for HTTP/HTTPS, deployed across Availability Zones.
- **Listener**: waits on a port and protocol (80, 443) and applies rules.
- **Target group**: the registered EC2 instances plus the health check settings.
- **Health checks**: the ALB only routes to healthy targets.
- **Auto Scaling Group**: adds instances, which join the target group after passing health checks.
- **Route 53**: DNS that points the domain to the ALB.
- **Security groups**: the ALB accepts 80/443 from the internet; EC2 accepts traffic only from the ALB's security group.
- **TLS termination**: HTTPS ends at the ALB (certificate from AWS Certificate Manager).
- **CloudWatch**: metrics such as request count, latency and healthy host count.

## The nine steps

1. **Visitors**: customers reach the shop through the internet.
2. **DNS**: Route 53 resolves the domain to the load balancer.
3. **Application Load Balancer**: the receptionist accepts HTTP/HTTPS requests.
4. **Listener**: ports 80 and 443, and rules for each request.
5. **Target Group**: two EC2 web servers, one per Availability Zone.
6. **Traffic Distribution**: requests are shared across healthy instances.
7. **Health Checks**: one server turns red and new requests go to healthy targets.
8. **Scaling**: Auto Scaling adds a third instance, which joins after passing health checks.
9. **Complete Architecture**: the full flow with security groups, TLS termination and CloudWatch.

## Moving-object legend

| Object | Meaning |
|---|---|
| ✉️ | Incoming HTTP request |
| 🛒 | Customer request |
| ✅ | Healthy target |
| ❌ | Unhealthy target |
| 📦 | Server response |
| 🛡️ | HTTPS security |
| 📊 | Monitoring activity |

## Interactivity

Play, Pause, Reset, click any step, and **Fail a server** to watch traffic reroute. **Restore server** runs a simulated health check before the server turns green again.

## Run locally

```bash
cd application-load-balancer-visual
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy to GitHub Pages

1. Push this folder to a new GitHub repository.
2. Open Settings, then Pages, then choose the `main` branch and the `/ (root)` folder.
3. Visit `https://<your-username>.github.io/application-load-balancer-visual/`.

## Project structure

```
application-load-balancer-visual/
├── index.html      page and inline SVG diagram
├── css/style.css   themes, layout, animations
├── js/app.js       steps, reveal logic, failure simulation
├── .nojekyll
├── LICENSE         MIT
└── README.md
```

## Customisation

- Edit the `STEPS` array in `js/app.js` for titles and captions.
- Edit the `PK` array to change moving objects, paths, timing and the steps they appear in.
- Change colours in `css/style.css`; diagram colours are in the `.box`, `.ec2` and `.az` rules and in the SVG attributes.
- Change the domain and names directly in `index.html`.

## Licence

MIT. See `LICENSE`.

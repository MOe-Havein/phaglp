#!/usr/bin/env bash

set -e

mkdir -p ai/tasks/admin

############################################
# ADMIN TASK 01
############################################

cat > ai/tasks/admin/01-admin-ui-modernization.md <<'EOF'
# Admin Dashboard UI Modernization

Execute ONLY this task.

Goals:
- Modernize the admin dashboard UI
- Improve layout hierarchy
- Improve spacing and responsiveness
- Add professional analytics cards
- Improve sidebar navigation UX
- Improve mobile usability

Requirements:
- Use TailwindCSS
- Keep current business logic
- Preserve existing routes
- Keep dark mode compatibility
- Use semantic design tokens only

Design Direction:
- Clean SaaS dashboard
- Minimal
- Enterprise-grade
- Fast navigation
- Better typography
- Better card hierarchy

Add:
- Stats overview cards
- Activity section
- Better table styling
- Loading skeletons
- Empty states
- Better button consistency

Rules:
- No backend changes
- No Prisma changes
- No auth changes

After execution:
1. Show changed components
2. Explain UX improvements
3. Explain responsive improvements
4. STOP
EOF

############################################
# ADMIN TASK 02
############################################

cat > ai/tasks/admin/02-admin-analytics.md <<'EOF'
# Admin Dashboard Analytics System

Execute ONLY this task.

Goals:
- Enhance analytics widgets
- Improve chart presentation
- Add KPI overview
- Add recent activity metrics
- Add user growth analytics
- Add content performance analytics

Requirements:
- Use Recharts
- Use server-safe serialization
- Use responsive charts
- Add loading and empty states

Widgets:
- Total users
- Total lectures
- Revenue (if exists)
- Engagement
- Latest activity
- Growth percentage

Rules:
- No fake analytics
- Use real DB data
- Keep Prisma queries optimized

After execution:
1. Show changed files
2. Explain analytics architecture
3. Explain performance optimizations
4. STOP
EOF

############################################
# ADMIN TASK 03
############################################

cat > ai/tasks/admin/03-admin-performance.md <<'EOF'
# Admin Dashboard Performance Optimization

Execute ONLY this task.

Goals:
- Optimize admin dashboard performance
- Reduce unnecessary renders
- Improve data fetching
- Add caching where safe
- Improve bundle size
- Improve loading speed

Requirements:
- Use React memoization appropriately
- Optimize server queries
- Prevent waterfall fetching
- Use suspense/loading states
- Improve table rendering performance

Rules:
- No UI redesign
- No auth rewrites

Validation:
- Faster dashboard load
- Reduced rerenders
- Better Lighthouse metrics

After execution:
1. Show optimizations made
2. Explain performance wins
3. Explain remaining bottlenecks
4. STOP
EOF

############################################
# ADMIN TASK 04
############################################

cat > ai/tasks/admin/04-admin-security.md <<'EOF'
# Admin Dashboard Security Audit

Execute ONLY this task.

Goals:
- Harden admin authentication
- Verify RBAC protections
- Verify middleware protections
- Verify server action safety
- Verify admin route security

Requirements:
- Protect admin-only routes
- Prevent unauthorized access
- Prevent client-side privilege escalation
- Validate session handling

Rules:
- Keep current auth provider
- No frontend redesign

After execution:
1. Show security issues found
2. Show fixes applied
3. Explain remaining risks
4. STOP
EOF

############################################
# ADMIN TASK 05
############################################

cat > ai/tasks/admin/05-admin-final-polish.md <<'EOF'
# Admin Dashboard Final Polish

Execute ONLY this task.

Goals:
- Final UX polish
- Add micro interactions
- Improve accessibility
- Improve keyboard navigation
- Improve form UX
- Improve empty states
- Improve notifications/toasts

Requirements:
- Keep enterprise SaaS feel
- Maintain accessibility standards
- Improve consistency

Rules:
- No backend rewrites
- No auth rewrites

After execution:
1. Show final UI improvements
2. Explain accessibility enhancements
3. Explain final UX refinements
4. STOP
EOF

############################################
# ADMIN RUNNER
############################################

cat > ai/run-admin-task.sh <<'EOF'
#!/usr/bin/env bash

set -e

if [ -z "$1" ]; then
  echo "Usage:"
  echo "./ai/run-admin-task.sh 01"
  exit 1
fi

TASK_FILE="ai/tasks/admin/$1"*.md

echo "======================================="
echo "🚀 Running Admin Task: $TASK_FILE"
echo "======================================="

gemini -p "$(cat $TASK_FILE)"
EOF

chmod +x ai/run-admin-task.sh

echo ""
echo "✅ Admin dashboard AI task system created."
echo ""
echo "Run:"
echo "./ai/run-admin-task.sh 01"
echo ""

-- Templates table for design templates
create table if not exists public.templates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text not null,
  price decimal(10, 2) not null default 0,
  preview_image_url text,
  template_file_url text not null,
  tags text[] default '{}',
  featured boolean default false,
  created_by uuid references public.users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Purchases table
create table if not exists public.purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  template_id uuid not null references public.templates(id) on delete cascade,
  purchased_at timestamptz default now(),
  unique(user_id, template_id)
);

-- Indexes for better performance
create index if not exists idx_templates_category on public.templates(category);
create index if not exists idx_templates_featured on public.templates(featured);
create index if not exists idx_purchases_user on public.purchases(user_id);
create index if not exists idx_purchases_template on public.purchases(template_id);

alter table public.templates enable row level security;
alter table public.purchases enable row level security;


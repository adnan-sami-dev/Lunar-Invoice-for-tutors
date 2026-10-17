create table tutors (
    id text primary key,            -- clerk ID
    email text unique not null,
    first_name text not null,
    last_name text not null,
    created_at timestamptz not null default now(),
);

create table students (
    id text primary key,
    first_name text not null,
    last_name text not null,
    tutor_id text not null references tutors(id) on delete cascade,
    created_at timestamptz not null default now(),
);

create table invoices (
    id text primary key,
    tutor_id text not null references tutors(id) on delete cascade,
    student_id text not null references students(id) on delete cascade,
    amount_owing numeric(10,2) not null,        -- numeric is better than float for money values
    invoice_description text,
    created_at timestamptz not null default now(),
    paid_at timestamptz,
    status text not null default 'pending',
);

-- INDEXES : speed up search (important for scaling)

-- index for query "all students for a tutor"
create index students_for_tutor_x on students(tutor_id);

-- index for query "all invoices for a tutor"
create index invoices_for_tutor_x on invoices(tutor_id);

-- index for query "payment history/invoices for a student"
create index invoices_for_student_y on invoices(student_id);

-- index for queries "students with payments pending/ paid/ overdue"
create index students_paymt_status on invoices(status);
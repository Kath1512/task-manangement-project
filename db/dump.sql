--
-- PostgreSQL database dump
--

\restrict gpZmXHMseMaVZnpCB3TdtsqhuLe4mzIpxPY2V0dhyUpwlIlDhivyOJJlt9VGy0C

-- Dumped from database version 18.0
-- Dumped by pg_dump version 18.0

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: type_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.type_status AS ENUM (
    'Planned',
    'In progress',
    'Completed',
    'Cancelled'
);


ALTER TYPE public.type_status OWNER TO postgres;

--
-- Name: user_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_role AS ENUM (
    'admin',
    'leader',
    'developer'
);


ALTER TYPE public.user_role OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: projects; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.projects (
    id integer NOT NULL,
    description text NOT NULL,
    created_at date DEFAULT CURRENT_DATE,
    status public.type_status DEFAULT 'Planned'::public.type_status NOT NULL,
    deadline date NOT NULL,
    note text,
    title text DEFAULT 'No title'::text,
    creator_id integer,
    leader_id integer,
    team_id integer
);


ALTER TABLE public.projects OWNER TO postgres;

--
-- Name: projects_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.projects_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.projects_id_seq OWNER TO postgres;

--
-- Name: projects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.projects_id_seq OWNED BY public.projects.id;


--
-- Name: teams; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.teams (
    id integer NOT NULL,
    member_ids integer[] NOT NULL,
    leader_id integer NOT NULL
);


ALTER TABLE public.teams OWNER TO postgres;

--
-- Name: teams_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.teams_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.teams_id_seq OWNER TO postgres;

--
-- Name: teams_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.teams_id_seq OWNED BY public.teams.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username text NOT NULL,
    password text NOT NULL,
    email text NOT NULL,
    role public.user_role NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    full_name text
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: projects id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects ALTER COLUMN id SET DEFAULT nextval('public.projects_id_seq'::regclass);


--
-- Name: teams id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teams ALTER COLUMN id SET DEFAULT nextval('public.teams_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.projects (id, description, created_at, status, deadline, note, title, creator_id, leader_id, team_id) FROM stdin;
25	Jelly is hungry	2025-10-07	Planned	2025-10-18	good	Jelly projects	7	3	2
26	get a new gun	2025-10-07	Completed	2025-10-16	nice	John Wick new project	4	9	1
2	Lorem islpum	2025-10-03	Planned	2025-04-10	bad	No title	3	3	2
11	random	2025-10-04	In progress	2025-10-10	random	random title	1	3	2
9	add new close button	2025-10-04	Planned	2025-10-11	button must have red background	add button	1	3	2
8		2025-10-04	Planned	2025-10-11		Test	1	3	2
1	Testing a new project	2025-10-02	In progress	2025-03-10	good	No title	3	9	1
10		2025-10-04	Planned	2025-10-03		no title	1	9	1
7	Implement authentication and user management	2025-10-03	Completed	2025-11-15	This should support both email and Google sign-in	Auth & User Module	4	9	1
5	Build a new dashboard	2025-10-03	In progress	2025-12-31	This is a top priority project	Dashboard Project	2	9	1
20	harry needs a new magic stick	2025-10-07	In progress	2025-10-08	good	harry's project	8	3	2
21	Test interaction	2025-10-07	Completed	2025-10-09	no note	Test interaction	8	3	2
22	test interaction	2025-10-07	Planned	2025-10-08	test interaction	test interaction	8	3	2
23	test interaction	2025-10-07	Planned	2025-10-17	test interaction	test interaction	8	3	2
24	Test interaction	2025-10-07	Completed	2025-10-08	successfull	Test interaction (5)	8	3	2
27	create first project	2025-10-08	Completed	2025-10-10	done	Alice first project	2	9	1
28	Add filter for project and user	2025-10-08	In progress	2025-10-10	ok	Big project	9	9	1
29	cache need to be refreshed every 5 mins	2025-10-15	In progress	2025-10-17	do for user too	test cache project	2	9	1
30	add	2025-10-15	Planned	2025-10-18	add	add	2	9	1
31	update	2025-10-15	In progress	2025-10-16	good\n	update cache for user	2	9	1
32	test cache	2025-10-15	In progress	2025-10-16	ok	test cache duration	2	9	1
33	good	2025-10-15	Planned	2025-10-16	good	test cache duration 30s	2	9	1
34	god	2025-10-15	Completed	2025-10-16	god	test cache duration 1min	2	9	1
35	good	2025-10-15	Planned	2025-10-16	good	test cache duration 5 mins	2	9	1
36	good	2025-10-15	In progress	2025-10-16	good\n	handle duplicate project after adding project	2	9	1
37	abc	2025-10-15	Planned	2025-10-16		abc	2	9	1
38	test bed	2025-10-15	Planned	2025-10-09		test bed	2	9	1
39	done	2025-10-15	Completed	2025-10-16		remove duplicate	2	9	1
40	ok	2025-10-15	In progress	2025-10-16		test duplicate request	2	9	1
41	ok	2025-10-15	In progress	2025-10-16		test duplicate request	2	9	1
42		2025-10-15	Planned	2025-10-10		duplicate	2	9	1
43		2025-10-15	Completed	2025-10-16		check referesh cache button	2	9	1
44	abc	2025-10-15	In progress	2025-10-16		harry's project	8	3	2
45	abc	2025-10-15	In progress	2025-10-17		new project	3	3	2
\.


--
-- Data for Name: teams; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.teams (id, member_ids, leader_id) FROM stdin;
2	{5,7,8,17,3}	3
1	{6,2,4,18,9}	9
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, password, email, role, created_at, updated_at, full_name) FROM stdin;
3	kien	kien	kien@gmail.com	leader	2025-10-02 08:51:39.423343	2025-10-02 08:51:39.423343	Trinh Hoang Kien
1	kath	kath	kath@gmail.com	admin	2025-10-01 10:05:24.241718	2025-10-01 10:13:41.559939	Kath Philips
4	johnwick	john	john@gmail.com	developer	2025-10-02 09:12:36.223854	2025-10-02 09:12:36.223854	John Wick
5	nguyenvana	nguyenvana	nguyenvana@gmail.com	developer	2025-10-02 15:15:06.375348	2025-10-02 15:15:06.375348	Nguyen Van A
2	alice	alice	alice@gmail.com	developer	2025-10-01 10:14:55.748732	2025-10-01 10:14:55.748732	Alice Cooper
6	bob	bob	bob@gmail.com	developer	2025-10-02 16:59:35.744606	2025-10-02 16:59:35.744606	Bob Bappy
7	jelly	jelly	jelly@gmail.com	developer	2025-10-02 17:07:06.925002	2025-10-02 17:07:06.925002	Jelly Fish
8	harry	harry	harry@gmail.com	developer	2025-10-02 17:12:19.311297	2025-10-02 17:12:19.311297	Harry Potter
9	nemo	nemo	nemo@gmail.com	leader	2025-10-06 21:55:55.305181	2025-10-06 21:55:55.305181	Nemo Fish
17	david	david	david@gmail.com	developer	2025-10-07 13:22:43.031555	2025-10-07 13:22:43.031555	David Johnson
18	adam	adam	adam@gmail.com	developer	2025-10-07 13:27:10.974513	2025-10-07 13:27:10.974513	Adam Bert
19	admin	admin	admin@gmail.com	admin	2025-10-07 13:27:53.363058	2025-10-07 13:27:53.363058	admin
\.


--
-- Name: projects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.projects_id_seq', 45, true);


--
-- Name: teams_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.teams_id_seq', 2, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 19, true);


--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- Name: teams teams_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teams
    ADD CONSTRAINT teams_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: projects fk_creator; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT fk_creator FOREIGN KEY (creator_id) REFERENCES public.users(id);


--
-- Name: projects projects_leader_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_leader_id_fkey FOREIGN KEY (leader_id) REFERENCES public.users(id);


--
-- Name: projects projects_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id);


--
-- Name: teams teams_leader_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teams
    ADD CONSTRAINT teams_leader_id_fkey FOREIGN KEY (leader_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

\unrestrict gpZmXHMseMaVZnpCB3TdtsqhuLe4mzIpxPY2V0dhyUpwlIlDhivyOJJlt9VGy0C


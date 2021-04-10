--
-- PostgreSQL database dump
--

-- Dumped from database version 13.2 (Debian 13.2-1.pgdg100+1)
-- Dumped by pg_dump version 13.2

-- Started on 2021-04-10 16:51:13 -03

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

-- Role: ms_bank_account
-- DROP ROLE ms_bank_account;

CREATE ROLE ms_bank_account WITH
  LOGIN
  NOSUPERUSER
  INHERIT
  NOCREATEDB
  NOCREATEROLE
  NOREPLICATION
  ENCRYPTED PASSWORD 'md553d817723dbf076436bae17c9c0d16c4';

-- Role: ms_person
-- DROP ROLE ms_person;

CREATE ROLE ms_person WITH
  LOGIN
  NOSUPERUSER
  INHERIT
  NOCREATEDB
  NOCREATEROLE
  NOREPLICATION
  ENCRYPTED PASSWORD 'md52876584934e4d341d53a0c1f61a2640f';

--
-- TOC entry 2975 (class 1262 OID 16384)
-- Name: mini_bank; Type: DATABASE; Schema: -; Owner: master_user
--

\connect mini_bank

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 203 (class 1259 OID 16400)
-- Name: contas; Type: TABLE; Schema: public; Owner: master_user
--

CREATE TABLE public.contas (
    "idConta" integer NOT NULL,
    "idPessoa" integer NOT NULL,
    saldo money DEFAULT 0,
    "limiteSaqueDiario" money DEFAULT 0,
    "flagAtivo" boolean DEFAULT true NOT NULL,
    "tipoConta" integer NOT NULL,
    "dataCriacao" date DEFAULT CURRENT_DATE NOT NULL
);


ALTER TABLE public.contas OWNER TO master_user;

--
-- TOC entry 202 (class 1259 OID 16398)
-- Name: contas_idConta_seq; Type: SEQUENCE; Schema: public; Owner: master_user
--

CREATE SEQUENCE public."contas_idConta_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."contas_idConta_seq" OWNER TO master_user;

--
-- TOC entry 2977 (class 0 OID 0)
-- Dependencies: 202
-- Name: contas_idConta_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: master_user
--

ALTER SEQUENCE public."contas_idConta_seq" OWNED BY public.contas."idConta";


--
-- TOC entry 201 (class 1259 OID 16387)
-- Name: pessoas; Type: TABLE; Schema: public; Owner: master_user
--

CREATE TABLE public.pessoas (
    "idPessoa" integer NOT NULL,
    nome text NOT NULL,
    cpf text NOT NULL,
    "dataNascimento" date NOT NULL,
    senha bytea NOT NULL
);


ALTER TABLE public.pessoas OWNER TO master_user;

--
-- TOC entry 200 (class 1259 OID 16385)
-- Name: pessoas_idPessoa_seq; Type: SEQUENCE; Schema: public; Owner: master_user
--

CREATE SEQUENCE public."pessoas_idPessoa_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."pessoas_idPessoa_seq" OWNER TO master_user;

--
-- TOC entry 2979 (class 0 OID 0)
-- Dependencies: 200
-- Name: pessoas_idPessoa_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: master_user
--

ALTER SEQUENCE public."pessoas_idPessoa_seq" OWNED BY public.pessoas."idPessoa";


--
-- TOC entry 205 (class 1259 OID 16417)
-- Name: transacoes; Type: TABLE; Schema: public; Owner: master_user
--

CREATE TABLE public.transacoes (
    "idTransacao" integer NOT NULL,
    "idConta" integer NOT NULL,
    valor money NOT NULL,
    "dataTransacao" date DEFAULT CURRENT_DATE NOT NULL
);


ALTER TABLE public.transacoes OWNER TO master_user;

--
-- TOC entry 204 (class 1259 OID 16415)
-- Name: transacoes_idTransacao_seq; Type: SEQUENCE; Schema: public; Owner: master_user
--

CREATE SEQUENCE public."transacoes_idTransacao_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."transacoes_idTransacao_seq" OWNER TO master_user;

--
-- TOC entry 2981 (class 0 OID 0)
-- Dependencies: 204
-- Name: transacoes_idTransacao_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: master_user
--

ALTER SEQUENCE public."transacoes_idTransacao_seq" OWNED BY public.transacoes."idTransacao";


--
-- TOC entry 2817 (class 2604 OID 16403)
-- Name: contas idConta; Type: DEFAULT; Schema: public; Owner: master_user
--

ALTER TABLE ONLY public.contas ALTER COLUMN "idConta" SET DEFAULT nextval('public."contas_idConta_seq"'::regclass);


--
-- TOC entry 2816 (class 2604 OID 16390)
-- Name: pessoas idPessoa; Type: DEFAULT; Schema: public; Owner: master_user
--

ALTER TABLE ONLY public.pessoas ALTER COLUMN "idPessoa" SET DEFAULT nextval('public."pessoas_idPessoa_seq"'::regclass);


--
-- TOC entry 2822 (class 2604 OID 16420)
-- Name: transacoes idTransacao; Type: DEFAULT; Schema: public; Owner: master_user
--

ALTER TABLE ONLY public.transacoes ALTER COLUMN "idTransacao" SET DEFAULT nextval('public."transacoes_idTransacao_seq"'::regclass);


--
-- TOC entry 2967 (class 0 OID 16400)
-- Dependencies: 203
-- Data for Name: contas; Type: TABLE DATA; Schema: public; Owner: master_user
--

COPY public.contas ("idConta", "idPessoa", saldo, "limiteSaqueDiario", "flagAtivo", "tipoConta", "dataCriacao") FROM stdin;
\.


--
-- TOC entry 2965 (class 0 OID 16387)
-- Dependencies: 201
-- Data for Name: pessoas; Type: TABLE DATA; Schema: public; Owner: master_user
--

COPY public.pessoas ("idPessoa", nome, cpf, "dataNascimento", senha) FROM stdin;
\.


--
-- TOC entry 2969 (class 0 OID 16417)
-- Dependencies: 205
-- Data for Name: transacoes; Type: TABLE DATA; Schema: public; Owner: master_user
--

COPY public.transacoes ("idTransacao", "idConta", valor, "dataTransacao") FROM stdin;
\.


--
-- TOC entry 2982 (class 0 OID 0)
-- Dependencies: 202
-- Name: contas_idConta_seq; Type: SEQUENCE SET; Schema: public; Owner: master_user
--

SELECT pg_catalog.setval('public."contas_idConta_seq"', 1, false);


--
-- TOC entry 2983 (class 0 OID 0)
-- Dependencies: 200
-- Name: pessoas_idPessoa_seq; Type: SEQUENCE SET; Schema: public; Owner: master_user
--

SELECT pg_catalog.setval('public."pessoas_idPessoa_seq"', 1, false);


--
-- TOC entry 2984 (class 0 OID 0)
-- Dependencies: 204
-- Name: transacoes_idTransacao_seq; Type: SEQUENCE SET; Schema: public; Owner: master_user
--

SELECT pg_catalog.setval('public."transacoes_idTransacao_seq"', 1, false);


--
-- TOC entry 2829 (class 2606 OID 16409)
-- Name: contas contas_pkey; Type: CONSTRAINT; Schema: public; Owner: master_user
--

ALTER TABLE ONLY public.contas
    ADD CONSTRAINT contas_pkey PRIMARY KEY ("idConta");


--
-- TOC entry 2825 (class 2606 OID 16395)
-- Name: pessoas pessoas_pkey; Type: CONSTRAINT; Schema: public; Owner: master_user
--

ALTER TABLE ONLY public.pessoas
    ADD CONSTRAINT pessoas_pkey PRIMARY KEY ("idPessoa");


--
-- TOC entry 2831 (class 2606 OID 16423)
-- Name: transacoes transacoes_pkey; Type: CONSTRAINT; Schema: public; Owner: master_user
--

ALTER TABLE ONLY public.transacoes
    ADD CONSTRAINT transacoes_pkey PRIMARY KEY ("idTransacao");


--
-- TOC entry 2827 (class 2606 OID 16397)
-- Name: pessoas unique_cpf; Type: CONSTRAINT; Schema: public; Owner: master_user
--

ALTER TABLE ONLY public.pessoas
    ADD CONSTRAINT unique_cpf UNIQUE (cpf);


--
-- TOC entry 2833 (class 2606 OID 16424)
-- Name: transacoes conta_transacao; Type: FK CONSTRAINT; Schema: public; Owner: master_user
--

ALTER TABLE ONLY public.transacoes
    ADD CONSTRAINT conta_transacao FOREIGN KEY ("idConta") REFERENCES public.contas("idConta");


--
-- TOC entry 2832 (class 2606 OID 16410)
-- Name: contas pessoa_conta; Type: FK CONSTRAINT; Schema: public; Owner: master_user
--

ALTER TABLE ONLY public.contas
    ADD CONSTRAINT pessoa_conta FOREIGN KEY ("idPessoa") REFERENCES public.pessoas("idPessoa");


--
-- TOC entry 2976 (class 0 OID 0)
-- Dependencies: 203
-- Name: TABLE contas; Type: ACL; Schema: public; Owner: master_user
--

GRANT SELECT,INSERT,UPDATE ON TABLE public.contas TO ms_bank_account;
GRANT SELECT ON TABLE public.contas TO ms_person;


--
-- TOC entry 2978 (class 0 OID 0)
-- Dependencies: 201
-- Name: TABLE pessoas; Type: ACL; Schema: public; Owner: master_user
--

GRANT SELECT,INSERT,UPDATE ON TABLE public.pessoas TO ms_person;
GRANT SELECT ON TABLE public.pessoas TO ms_bank_account;


--
-- TOC entry 2980 (class 0 OID 0)
-- Dependencies: 205
-- Name: TABLE transacoes; Type: ACL; Schema: public; Owner: master_user
--

GRANT SELECT,INSERT,UPDATE ON TABLE public.transacoes TO ms_bank_account;
GRANT SELECT ON TABLE public.transacoes TO ms_person;


-- Completed on 2021-04-10 16:51:14 -03

--
-- PostgreSQL database dump complete
--


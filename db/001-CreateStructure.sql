--
-- PostgreSQL database dump
--

-- Dumped from database version 13.2 (Debian 13.2-1.pgdg100+1)
-- Dumped by pg_dump version 13.2

-- Started on 2021-04-11 16:14:08 -03

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

-- Role: ms_mini_bank
-- DROP ROLE ms_mini_bank;

CREATE ROLE ms_mini_bank WITH
  LOGIN
  NOSUPERUSER
  INHERIT
  NOCREATEDB
  NOCREATEROLE
  NOREPLICATION
  ENCRYPTED PASSWORD 'md53f42bc9e98fb94a78ee76f122eaf5571';

--
-- TOC entry 200 (class 1259 OID 16387)
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
-- TOC entry 201 (class 1259 OID 16394)
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
-- TOC entry 2970 (class 0 OID 0)
-- Dependencies: 201
-- Name: contas_idConta_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: master_user
--

ALTER SEQUENCE public."contas_idConta_seq" OWNED BY public.contas."idConta";


--
-- TOC entry 202 (class 1259 OID 16396)
-- Name: pessoas; Type: TABLE; Schema: public; Owner: master_user
--

CREATE TABLE public.pessoas (
    "idPessoa" integer NOT NULL,
    nome text NOT NULL,
    cpf text NOT NULL,
    "dataNascimento" date NOT NULL,
    senha text NOT NULL
);


ALTER TABLE public.pessoas OWNER TO master_user;

--
-- TOC entry 203 (class 1259 OID 16402)
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
-- TOC entry 2972 (class 0 OID 0)
-- Dependencies: 203
-- Name: pessoas_idPessoa_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: master_user
--

ALTER SEQUENCE public."pessoas_idPessoa_seq" OWNED BY public.pessoas."idPessoa";


--
-- TOC entry 204 (class 1259 OID 16404)
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
-- TOC entry 205 (class 1259 OID 16408)
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
-- TOC entry 2974 (class 0 OID 0)
-- Dependencies: 205
-- Name: transacoes_idTransacao_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: master_user
--

ALTER SEQUENCE public."transacoes_idTransacao_seq" OWNED BY public.transacoes."idTransacao";


--
-- TOC entry 2820 (class 2604 OID 16410)
-- Name: contas idConta; Type: DEFAULT; Schema: public; Owner: master_user
--

ALTER TABLE ONLY public.contas ALTER COLUMN "idConta" SET DEFAULT nextval('public."contas_idConta_seq"'::regclass);


--
-- TOC entry 2821 (class 2604 OID 16411)
-- Name: pessoas idPessoa; Type: DEFAULT; Schema: public; Owner: master_user
--

ALTER TABLE ONLY public.pessoas ALTER COLUMN "idPessoa" SET DEFAULT nextval('public."pessoas_idPessoa_seq"'::regclass);


--
-- TOC entry 2823 (class 2604 OID 16412)
-- Name: transacoes idTransacao; Type: DEFAULT; Schema: public; Owner: master_user
--

ALTER TABLE ONLY public.transacoes ALTER COLUMN "idTransacao" SET DEFAULT nextval('public."transacoes_idTransacao_seq"'::regclass);


--
-- TOC entry 2825 (class 2606 OID 16414)
-- Name: contas contas_pkey; Type: CONSTRAINT; Schema: public; Owner: master_user
--

ALTER TABLE ONLY public.contas
    ADD CONSTRAINT contas_pkey PRIMARY KEY ("idConta");


--
-- TOC entry 2827 (class 2606 OID 16416)
-- Name: pessoas pessoas_pkey; Type: CONSTRAINT; Schema: public; Owner: master_user
--

ALTER TABLE ONLY public.pessoas
    ADD CONSTRAINT pessoas_pkey PRIMARY KEY ("idPessoa");


--
-- TOC entry 2831 (class 2606 OID 16418)
-- Name: transacoes transacoes_pkey; Type: CONSTRAINT; Schema: public; Owner: master_user
--

ALTER TABLE ONLY public.transacoes
    ADD CONSTRAINT transacoes_pkey PRIMARY KEY ("idTransacao");


--
-- TOC entry 2829 (class 2606 OID 16420)
-- Name: pessoas unique_cpf; Type: CONSTRAINT; Schema: public; Owner: master_user
--

ALTER TABLE ONLY public.pessoas
    ADD CONSTRAINT unique_cpf UNIQUE (cpf);


--
-- TOC entry 2833 (class 2606 OID 16421)
-- Name: transacoes conta_transacao; Type: FK CONSTRAINT; Schema: public; Owner: master_user
--

ALTER TABLE ONLY public.transacoes
    ADD CONSTRAINT conta_transacao FOREIGN KEY ("idConta") REFERENCES public.contas("idConta");


--
-- TOC entry 2832 (class 2606 OID 16426)
-- Name: contas pessoa_conta; Type: FK CONSTRAINT; Schema: public; Owner: master_user
--

ALTER TABLE ONLY public.contas
    ADD CONSTRAINT pessoa_conta FOREIGN KEY ("idPessoa") REFERENCES public.pessoas("idPessoa");


--
-- TOC entry 2969 (class 0 OID 0)
-- Dependencies: 200
-- Name: TABLE contas; Type: ACL; Schema: public; Owner: master_user
--

GRANT SELECT,INSERT,UPDATE ON TABLE public.contas TO ms_mini_bank;


--
-- TOC entry 2971 (class 0 OID 0)
-- Dependencies: 202
-- Name: TABLE pessoas; Type: ACL; Schema: public; Owner: master_user
--

GRANT SELECT,INSERT,UPDATE ON TABLE public.pessoas TO ms_mini_bank;


--
-- TOC entry 2973 (class 0 OID 0)
-- Dependencies: 204
-- Name: TABLE transacoes; Type: ACL; Schema: public; Owner: master_user
--

GRANT SELECT,INSERT,UPDATE ON TABLE public.transacoes TO ms_mini_bank;


-- Completed on 2021-04-11 16:14:08 -03

--
-- PostgreSQL database dump complete
--


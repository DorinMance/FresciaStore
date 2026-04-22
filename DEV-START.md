# Cum pornești development cu preview live

## Prima dată (o singură dată)

```bash
# 1. Autentificare Shopify (se deschide browser-ul)
shopify auth login --store fresciastore.myshopify.com
```

## De fiecare dată când lucrezi

```bash
# Navighează în folder
cd "D:/Sites/Clienti/04. FresciaStore"

# Pornește preview live cu date reale din magazin
shopify theme dev --store fresciastore.myshopify.com
```

Shopify CLI îți dă un URL de tipul:
`http://127.0.0.1:9292` → vezi tema cu produsele tale reale, live reload la fiecare salvare

## Workflow complet

1. `shopify theme dev` → editezi și vezi instant
2. Când ești mulțumit → `git add . && git commit && git push`
3. GitHub sync-ează automat cu Shopify draft theme
4. În Shopify Admin → "Publicare" când vrei să fie live

## Comenzi utile

```bash
# Pull ultimele fișiere din Shopify (dacă ai editat din Customizer)
shopify theme pull --store fresciastore.myshopify.com

# Push fișiere locale pe Shopify (fără git)
shopify theme push --store fresciastore.myshopify.com

# Verifică erori Liquid în temă
shopify theme check
```

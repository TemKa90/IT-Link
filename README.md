# Тестовое задание ИТ-ЛИНК

Этот проект использует Docker Compose для контейниризации нескольких сервисов, включая NestJS API, клиентское приложение, базу данных PostgreSQL и pgAdmin.

## Содержание
- [Предварительные требования](#предварительные-требования)
- [Установка](#установка)
- [Запуск проекта](#запуск-проекта)
- [Доступ к сервисам](#доступ-к-сервисам)
- [Остановка проекта](#остановка-проекта)

## Предварительные требования
Для запуска этого проекта вам потребуется установить:
- Docker

## Установка
1. Клонируйте репозиторий вашего проекта:
```bash
git clone https://github.com/TemKa90/IT-Link
cd IT-Link
```
2. Создайте файл `.env` в корневой директории проекта:
```env
NODE_ENV=development
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name

# NestJS
APP_PORT=3000

```
Замените your_db_user, your_db_password и your_db_name на ваши значения.

## Запуск проекта
```bash
docker-compose up -d --build
```

## Доступ к сервисам

| Сервис               | URL                      | Учетные данные                  |
|-----------------------|--------------------------|----------------------------------|
| Клиентское приложение | http://localhost:8080    | -                                |
| NestJS API            | http://localhost:3000    | -                                |
| pgAdmin               | http://localhost:5050    | Логин: `admin@mail.com`<br>Пароль: `admin` |

## Остановка проекта

```bash
# Остановка с сохранением данных
docker-compose down

# Полная остановка с удалением данных
docker-compose down -v
```
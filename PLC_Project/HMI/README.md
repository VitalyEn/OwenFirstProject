# HMI — визуализация щита ЩУ

## Быстрый просмотр

Откройте в браузере (демо 800×480):

**`WebVisu/index.html`**

## Сборка в CODESYS

Подробная пошаговая инструкция: **`CODESYS_Visu_800x480.md`** (создание экранов, координаты, привязки `GVL_HMI`, навигация, проверка).

Кратко:

1. Разрешение **800×480** (СПК210-07).
2. 5 экранов: Main, Pumps, Valves, Levels, Settings.
3. Переменные — **`GVL_HMI`**, обновление — **`PRG_HMI`**.
4. WebVisu — **`WebVisu_Настройка.md`**.

## SVG-фоны (импорт в Visu Editor)

Папка **`svg/`** — готовые подложки 800×480:

- `Visu_Main_bg.svg`, `Visu_Pumps_bg.svg`, `Visu_Valves_bg.svg`, `Visu_Levels_bg.svg`, `Visu_Settings_bg.svg`
- `Visu_Alarm_banner.svg` — полоса аварии поверх экрана

Инструкция импорта: **`svg/README.md`**

## Файлы

| Файл | Описание |
|------|----------|
| `svg/*.svg` | Фоны экранов для CODESYS |
| `WebVisu/index.html` | Интерфейс оператора |
| `WebVisu/styles.css` | Стили |
| `WebVisu/app.js` | Логика экранов |
| `WebVisu/plc-bindings.js` | Имена тегов CODESYS |
| `CODESYS_Visu_800x480.md` | Координаты элементов для Visu Editor |

## WebVisu на контроллере

После загрузки проекта: `http://<IP>:8080/webvisu.htm`

В `app.js` установите `USE_DEMO = false` при подключении к реальным тегам.

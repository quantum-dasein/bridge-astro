# Термины, которые должна подтвердить Лариса Константиновна

Переводчик берёт узбекские термины из словаря `src/data/fidicGlossary.mjs`,
а словарь — только из уже опубликованного на bridgeconsult.uz и fidic.uz.
На этих сайтах одно и то же понятие местами названо по-разному — иногда даже
внутри одного fidic.uz. Модели нужен один вариант, иначе на лекции она будет
называть одно понятие то так, то эдак.

Пока выбрано так: сначала вариант bridgeconsult.uz, затем глоссария fidic.uz.
Отметьте правильный вариант. Если правильного нет — впишите свой.

| Понятие | Сейчас в словаре | Другой вариант на сайтах | Где встречается |
|---|---|---|---|
| Уведомление (Notice) | **xabarnoma** | bildirishnoma | xabarnoma — bridgeconsult.uz (23 раза), fidic.uz (22); bildirishnoma — fidic.uz (99), в т.ч. «Bildirishnomalar va kommunikatsiyalar» (Sub-Clause 1.3) |
| Совет по спорам (DAAB) | **nizolar kengashi** | nizolar bo‘yicha kengash | первый — bridgeconsult.uz; второй — глоссарий fidic.uz |
| Пресекательный срок (time-bar) | **qat’iy muddat** | 28 kunlik muddat | первый — bridgeconsult.uz; второй — глоссарий fidic.uz |
| Неустойка за просрочку (Delay Damages) | **kechikish uchun jarima** | kechikish uchun to‘lov | оба на fidic.uz: глоссарий и Sub-Clause 8.8 |
| Обеспечение исполнения (Performance Security) | **bajarilish ta’minoti** | ijro kafolati | оба на fidic.uz: глоссарий и Sub-Clause 4.2 |
| Исключительное событие (Exceptional Event) | **istisno hodisa** | favqulodda hodisa | оба на fidic.uz: глоссарий и Clause 18 |
| Приёмка (Taking-Over) | **qabul qilish** | ishni qabul qilish | первый — bridgeconsult.uz и глоссарий fidic.uz; второй — Sub-Clause 10.1 |
| Приостановка работ (Suspension) | **ishlarni to‘xtatib turish** | ishlarni to‘xtatish | первый — bridgeconsult.uz; второй — Sub-Clause 8.9 на fidic.uz |
| Программа работ (Programme) | **ishlar dasturi** | ish dasturi | первый — оба сайта; второй — Sub-Clause 8.3 на fidic.uz |
| DNP | **nuqsonlar xabar berish davri** (период уведомления о дефектах) | kafolat majburiyatlari davri (период гарантийных обязательств) | первый — глоссарий fidic.uz; второй — bridgeconsult.uz. Это разные русские названия одного периода; в словаре оба, английское DNP привязано к первому |
| Испытания при завершении | **yakunlashda sinovlar** | yakunlashdagi sinovlar | глоссарий и Clause 9 на fidic.uz |

## И весь словарь целиком

Узбекские тексты обоих сайтов не вычитывал носитель-юрист — справочник
пунктов fidic.uz сам так и помечен. Поэтому и остальные ~95 терминов стоит
один раз пройти глазами: `src/data/fidicGlossary.mjs`, колонка `uz`.

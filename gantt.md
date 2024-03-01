```mermaid
gantt
    title Intership Yokohama
    dateFormat DD/MM/YYYY
    tickInterval 1week
    weekday monday
    excludes weekends
    section Design
        Prototype :a1, 26/02/2024, 5d
        database design :a2, 26/02/2024, 10d
        mockup :a3, after a2, 5d
    
    section development
       database :a4, after a1, 5d
       dashboard :dash, after a5, 10d
       add employee: a10, after dash, 1d
       add competence: a11, after a10, 1d
       add position: a12, after a11, 1d
       add training: a13, after a12, 1d
       edit competence position training: a14, after a13, 1d
       forecast planner :a5, after a2, 5d
       PDF export :a6, after a5, 2w
       history report :a7, after a5, 2d
       Study plan: a8, after a7, 5d
       individual training plan: a9, after a8, 7d
        testing: test, after a14, 5d
        modification: mod, after test, 5d
        approval: app, after mod, 3d
```
from django.urls import path

from . import views
app_name = 'excel_analyzer'
urlpatterns = [
    path('', views.index, name='index'),
    path('analyze/', views.analyze, name='analyze'),
    path('update_xl/', views.update_excel, name='update_xl'),
    path('def_name_col/', views.def_name_col, name='def_col_name'),
]

from app.report_cards.models import ReportCard, ReportCardLine
from app.report_cards.schemas import (
    ReportCardCreate,
    ReportCardLineCreate,
    ReportCardLineRead,
    ReportCardLineUpdate,
    ReportCardRead,
    ReportCardUpdate,
)
from app.security.rbac import Permission
from app.shared.crud import CrudRouterFactory

report_cards_router = CrudRouterFactory(
    prefix="/report-cards",
    tags=["report-cards"],
    model=ReportCard,
    read_schema=ReportCardRead,
    create_permission=Permission.MANAGE_REPORT_CARDS,
    update_permission=Permission.MANAGE_REPORT_CARDS,
    delete_permission=Permission.MANAGE_REPORT_CARDS,
).build(ReportCardCreate, ReportCardUpdate)

report_card_lines_router = CrudRouterFactory(
    prefix="/report-card-lines",
    tags=["report-card-lines"],
    model=ReportCardLine,
    read_schema=ReportCardLineRead,
    create_permission=Permission.MANAGE_REPORT_CARDS,
    update_permission=Permission.MANAGE_REPORT_CARDS,
    delete_permission=Permission.MANAGE_REPORT_CARDS,
).build(ReportCardLineCreate, ReportCardLineUpdate)


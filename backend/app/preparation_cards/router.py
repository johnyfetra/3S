from app.preparation_cards.models import PreparationCard
from app.preparation_cards.schemas import PreparationCardCreate, PreparationCardRead, PreparationCardUpdate
from app.security.rbac import Permission
from app.shared.crud import CrudRouterFactory

router = CrudRouterFactory(
    prefix="/preparation-cards",
    tags=["preparation-cards"],
    model=PreparationCard,
    read_schema=PreparationCardRead,
    create_permission=Permission.WRITE_LOGBOOK,
    update_permission=Permission.WRITE_LOGBOOK,
    delete_permission=Permission.WRITE_LOGBOOK,
).build(PreparationCardCreate, PreparationCardUpdate)


import {
  Action,
  ActionCell,
  Cell,
  Table,
  CellContext,
} from "../../../../components/common/table";
import { StorageLocationMapping } from "../../../../types/sku";

type Props = {
  storageLocations: StorageLocationMapping[];
  setStorageLocations: Function;
  setOpenDialog:Function;
  setIsEditing:Function;
  setSelectedRow:Function;
  setEditIndex : Function;
};

const StorageLocations: React.FC<Props> = ({
  storageLocations,
  setStorageLocations,
  setOpenDialog,
  setIsEditing,
  setSelectedRow,
  setEditIndex,
}) => {
  const handleDelete = (rowIndex: number) => {
    
    const updatedLocations = [
      ...storageLocations.slice(0, rowIndex),
      ...storageLocations.slice(rowIndex + 1),
    ];
    setStorageLocations(updatedLocations);
  };

  const handleEdit = (rowIndex: number) => {
    // Future implementation for editing a row
    // Can open a modal or navigate to a detailed view
    const selectedLocation = storageLocations[rowIndex];
    setEditIndex(rowIndex);
    setSelectedRow(selectedLocation);
    setIsEditing(true);
    setOpenDialog(true);
  };

  return (
    <Table<StorageLocationMapping> data={storageLocations}>
      <Cell type="text" title="Location" value="location" />
      <Cell type="text" title="Receiving Status" value="receivingStatus" />
      <Cell type="text" title="Type" value="type" />
      <Cell type="text" title="Condition" value="condition" />
      <Cell type="text" title="Assigned Capacity" value="assignedCapacity" />
      <Cell type="text" title="Maximum Capacity" value="maximumCapacity" />

      <ActionCell>
        <Action type="edit"
        onClick={(cell) => handleEdit(cell.row.index)}
         />
        <Action
          type="delete"
          onClick={(cell) => handleDelete(cell.row.index)}
        />
      </ActionCell>
    </Table>
  );
};

export default StorageLocations;

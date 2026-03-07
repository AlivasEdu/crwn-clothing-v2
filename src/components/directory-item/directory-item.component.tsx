import { useNavigate } from "react-router-dom";


import {
  DirectoryItemContainer,
  BackgroundImage,
  Body,
} from "./directory-item.styles";

export type DirectoryItemType = {
  id: number;
  imageUrl: string;
  title: string;
  route: string;
}

type DirectoryItemProps = {
  category: DirectoryItemType;
}

export const DirectoryItem = ({ category }: DirectoryItemProps) => {
  const { imageUrl, title, route } = category;
  const navigate = useNavigate();
  
  const onNavigateHandler = () => navigate(route);

  return (
    <DirectoryItemContainer onClick={onNavigateHandler}>
      <BackgroundImage $imageUrl={imageUrl} />
      <Body>
        <h2>{title}</h2>
        <p>Shop Now</p>
      </Body>
    </DirectoryItemContainer>
  );
};

export default DirectoryItem;

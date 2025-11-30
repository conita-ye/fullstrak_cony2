import { HomePageProps } from '../Interface/HomePageProps';
import { Product } from '../../../../types';

export interface Props {
  productos: Product[];
  onNavigate: HomePageProps['onNavigate'];
  addToCart: (productId: string, quantity: number) => void;
}
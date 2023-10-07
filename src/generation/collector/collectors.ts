import { Accessory, Package, PackageList, PackageListEntry } from '@/types';
import { Collector } from './collector';

export const accessoriesCollector = new Collector<Accessory>();
export const economyPackageListEntryCollector = new Collector<PackageListEntry>();
export const catalogManagerPackageListEntryCollector = new Collector<PackageListEntry>();

export const packagesCollector = new Collector<Package>();
export const packageListsCollector = new Collector<PackageList>();

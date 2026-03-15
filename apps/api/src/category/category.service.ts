import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { type CategoryResponse } from '@workspace/shared/schema/category/category.response';
@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  //
  async findAll(): Promise<CategoryResponse[]> {
    return this.prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }
}
